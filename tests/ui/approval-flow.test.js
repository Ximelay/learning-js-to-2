import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { FRONTEND_URL, ADMIN_EMAIL, ADMIN_PASSWORD, uniqueUser } from '../helpers/env.js';
import { createApiClient, loginAsAdmin, deleteUserByEmail } from '../helpers/api.js';

// ============================================================================
// UI-тесты — Selenium WebDriver, headless Chrome.
// Перед запуском должны быть подняты frontend (5173) и backend (3000).
// Установка: `npm install` в каталоге tests/ + установленный Chrome/Chromium.
// ============================================================================

const TIMEOUT = 15000;
let driver;
let admin;
const createdEmails = [];

before(async () => {
  const options = new chrome.Options();
  if (process.env.HEADLESS !== '0') options.addArguments('--headless=new');
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,900');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  admin = await loginAsAdmin();
});

after(async () => {
  if (driver) await driver.quit();
  for (const email of createdEmails) {
    try { await deleteUserByEmail(admin, email); } catch { /* ignore */ }
  }
});

async function fillRegisterForm(u) {
  await driver.get(`${FRONTEND_URL}/register`);
  await driver.wait(until.elementLocated(By.css('input[type="email"]')), TIMEOUT);
  await driver.findElement(By.css('input[type="email"]')).sendKeys(u.email);
  // имя пользователя — единственный input без типа email/password
  const inputs = await driver.findElements(By.css('form input'));
  // ожидаемый порядок: email, username, password
  await inputs[1].sendKeys(u.username);
  await driver.findElement(By.css('input[type="password"]')).sendKeys(u.password);
  await driver.findElement(By.css('button[type="submit"]')).click();
}

test('UI: после успешной регистрации показывается экран ожидания одобрения', async () => {
  const u = uniqueUser('ui_pending');
  createdEmails.push(u.email);

  await fillRegisterForm(u);

  const heading = await driver.wait(
    until.elementLocated(By.xpath("//h2[contains(., 'Заявка отправлена')]")),
    TIMEOUT
  );
  const headingText = await heading.getText();
  assert.match(headingText, /Заявка отправлена/);

  const body = await driver.findElement(By.css('.panel')).getText();
  assert.match(body, /ожидает одобрения администратора/i);

  // должна быть кнопка-ссылка ко входу
  const loginLink = await driver.findElement(By.linkText('К странице входа'));
  assert.ok(await loginLink.isDisplayed());
});

test('UI: попытка входа неодобренного пользователя показывает ошибку', async () => {
  const u = uniqueUser('ui_login_blocked');
  createdEmails.push(u.email);

  // регистрируем заранее через API (быстрее, чем повторно через UI)
  await createApiClient().post('/auth/register', u);

  await driver.get(`${FRONTEND_URL}/login`);
  await driver.wait(until.elementLocated(By.css('input[type="email"]')), TIMEOUT);
  await driver.findElement(By.css('input[type="email"]')).sendKeys(u.email);
  await driver.findElement(By.css('input[type="password"]')).sendKeys(u.password);
  await driver.findElement(By.css('button[type="submit"]')).click();

  const errorEl = await driver.wait(until.elementLocated(By.css('.error')), TIMEOUT);
  const errText = await errorEl.getText();
  assert.match(errText, /ожидает одобрения/i);

  // и мы по-прежнему на /login
  const url = await driver.getCurrentUrl();
  assert.match(url, /\/login$/);
});

test('UI: админ одобряет пользователя — после этого тот успешно входит', async () => {
  const u = uniqueUser('ui_full_flow');
  createdEmails.push(u.email);

  // 1. зарегистрировать пользователя через API
  await createApiClient().post('/auth/register', u);

  // 2. зайти как админ через UI
  await driver.get(`${FRONTEND_URL}/login`);
  await driver.wait(until.elementLocated(By.css('input[type="email"]')), TIMEOUT);
  await driver.findElement(By.css('input[type="email"]')).sendKeys(ADMIN_EMAIL);
  await driver.findElement(By.css('input[type="password"]')).sendKeys(ADMIN_PASSWORD);
  await driver.findElement(By.css('button[type="submit"]')).click();
  // ждём, пока браузер действительно уйдёт со страницы /login (значит, кука выдана)
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return !/\/login(?:[/?#]|$)/.test(url);
  }, TIMEOUT, 'Админ не залогинился: URL остался на /login');

  // 3. перейти в админку — список пользователей
  await driver.get(`${FRONTEND_URL}/admin/users`);
  const usersTable = await driver.wait(
    until.elementLocated(By.css('.admin-table')),
    TIMEOUT,
    'Не дождались таблицы /admin/users — возможно, не сработал auth (кука/refresh)'
  );
  assert.ok(usersTable);

  // 4. отфильтровать по email тестового пользователя — поле поиска уже есть
  const search = await driver.findElement(By.css('.admin-bar input'));
  await search.sendKeys(u.email);

  // 5. нажать кнопку «Одобрить» в строке пользователя
  const approveBtn = await driver.wait(
    until.elementLocated(
      By.xpath("//table[contains(@class,'admin-table')]//button[normalize-space()='Одобрить']")
    ),
    TIMEOUT
  );
  // accept native confirm()
  await driver.executeScript('window.confirm = () => true;');
  await approveBtn.click();

  // ждём пока чип в строке станет «одобрен»
  await driver.wait(async () => {
    const chips = await driver.findElements(
      By.xpath("//table[contains(@class,'admin-table')]//span[contains(@class,'chip-active') and normalize-space()='одобрен']")
    );
    return chips.length > 0;
  }, TIMEOUT, 'Чип «одобрен» не появился после нажатия «Одобрить»');

  // 6. logout admin → login as user
  await driver.manage().deleteAllCookies();
  await driver.get(`${FRONTEND_URL}/login`);
  await driver.wait(until.elementLocated(By.css('input[type="email"]')), TIMEOUT);
  await driver.findElement(By.css('input[type="email"]')).sendKeys(u.email);
  await driver.findElement(By.css('input[type="password"]')).sendKeys(u.password);
  await driver.findElement(By.css('button[type="submit"]')).click();

  // ожидаем редирект с /login (на главную)
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return !/\/login$/.test(url);
  }, TIMEOUT, 'После одобрения пользователь должен войти и быть переадресован с /login');

  const url = await driver.getCurrentUrl();
  assert.doesNotMatch(url, /\/login$/);
});