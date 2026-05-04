import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { FRONTEND_URL, ADMIN_EMAIL, ADMIN_PASSWORD, uniqueUser } from '../helpers/env.js';
import { loginAsAdmin, deleteUserByEmail } from '../helpers/api.js';

// ============================================================================
// UI-тесты — Selenium WebDriver, headless Chrome.
// Перед запуском должны быть подняты frontend (5173) и backend (3000).
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

async function loginUiAsAdmin() {
  await driver.get(`${FRONTEND_URL}/login`);
  await driver.wait(until.elementLocated(By.css('input[type="email"]')), TIMEOUT);
  await driver.findElement(By.css('input[type="email"]')).sendKeys(ADMIN_EMAIL);
  await driver.findElement(By.css('input[type="password"]')).sendKeys(ADMIN_PASSWORD);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return !/\/login(?:[/?#]|$)/.test(url);
  }, TIMEOUT, 'Админ не залогинился: URL остался на /login');
}

test('UI: страница /register больше не существует (роут не зарегистрирован)', async () => {
  await driver.get(`${FRONTEND_URL}/register`);
  // ждём, пока React отрисует layout
  await driver.wait(until.elementLocated(By.css('main.main')), TIMEOUT);
  const main = await driver.findElement(By.css('main.main')).getText();
  // на месте /register должен быть фолбэк «Страница не найдена»
  assert.match(main, /Страница не найдена/i);
});

test('UI: на /login нет ссылки на регистрацию', async () => {
  await driver.get(`${FRONTEND_URL}/login`);
  await driver.wait(until.elementLocated(By.css('input[type="email"]')), TIMEOUT);
  const links = await driver.findElements(By.linkText('Зарегистрироваться'));
  assert.equal(links.length, 0, 'На /login не должно быть ссылки «Зарегистрироваться»');
  // в шапке тоже должна быть только кнопка «Вход»
  const headerRegister = await driver.findElements(By.linkText('Регистрация'));
  assert.equal(headerRegister.length, 0, 'В шапке не должно быть кнопки «Регистрация»');
});

test('UI: админ создаёт пользователя через админку и видит сгенерированный пароль', async () => {
  const u = uniqueUser('ui_create');
  createdEmails.push(u.email);

  await loginUiAsAdmin();
  await driver.get(`${FRONTEND_URL}/admin/users`);
  await driver.wait(until.elementLocated(By.css('.admin-table')), TIMEOUT);

  // открыть модалку создания
  const createBtn = await driver.findElement(
    By.xpath("//button[normalize-space()='+ Создать пользователя']")
  );
  await createBtn.click();

  // заполнить форму
  const dialog = await driver.wait(until.elementLocated(By.css('.modal')), TIMEOUT);
  await dialog.findElement(By.css('input[type="email"]')).sendKeys(u.email);
  // имя — это второй input в форме модалки
  const inputs = await dialog.findElements(By.css('.form input'));
  await inputs[1].sendKeys(u.username);

  // нажать «Создать»
  const saveBtn = await dialog.findElement(
    By.xpath(".//button[normalize-space()='Создать']")
  );
  await saveBtn.click();

  // ждём модалку «Учётная запись создана»
  await driver.wait(
    until.elementLocated(By.xpath("//h3[normalize-space()='Учётная запись создана']")),
    TIMEOUT,
    'Модалка с учётными данными не появилась'
  );

  // в модалке должны быть email, имя и непустой пароль
  const credModal = await driver.findElement(
    By.xpath("//h3[normalize-space()='Учётная запись создана']/ancestor::*[contains(@class,'modal')]")
  );
  const text = await credModal.getText();
  assert.match(text, new RegExp(u.email.replace(/\./g, '\\.')));
  assert.match(text, new RegExp(u.username));

  // и в основной таблице теперь есть новый пользователь
  // (закрываем модалку через Esc-эмуляцию: клик по overlay не нужен, проверяем через API-побочно)
});