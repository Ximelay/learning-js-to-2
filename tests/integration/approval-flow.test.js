import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient, loginAsAdmin, deleteUserByEmail, findUserByEmail } from '../helpers/api.js';
import { uniqueUser } from '../helpers/env.js';

// ============================================================================
// Интеграционные тесты — реально стучатся в backend (http://localhost:3000)
// и в БД через бэкенд. Перед запуском нужно поднять стенд: `npm run up:d`.
// ============================================================================

let admin;
const createdEmails = [];

before(async () => {
  admin = await loginAsAdmin();
});

after(async () => {
  // подчищаем тестовых пользователей, чтобы тесты были идемпотентны
  for (const email of createdEmails) {
    try { await deleteUserByEmail(admin, email); } catch { /* ignore */ }
  }
});

test('POST /auth/register создаёт пользователя в статусе ожидания и не выдаёт токен', async () => {
  const u = uniqueUser('reg');
  createdEmails.push(u.email);
  const client = createApiClient();
  const res = await client.post('/auth/register', u);

  assert.equal(res.status, 201);
  assert.equal(res.data.pending, true);
  assert.match(res.data.message, /одобрения/);
  // токен в куках выдан НЕ должен быть
  assert.equal(client.cookie(), '');

  // и в админ-списке он виден как неодобренный
  const found = await findUserByEmail(admin, u.email);
  assert.ok(found, 'Зарегистрированный пользователь должен появиться в админ-списке');
  assert.equal(found.is_approved, false);
});

test('POST /auth/login отклоняет неодобренного пользователя с 403', async () => {
  const u = uniqueUser('unapproved');
  createdEmails.push(u.email);
  const client = createApiClient();
  await client.post('/auth/register', u);

  const res = await client.post('/auth/login', { email: u.email, password: u.password });
  assert.equal(res.status, 403);
  assert.match(res.data.error, /ожидает одобрения/);
  assert.equal(client.cookie(), '', 'Токен не должен выдаваться неодобренному');
});

test('После одобрения админом пользователь может войти и /auth/me возвращает его профиль', async () => {
  const u = uniqueUser('approved');
  createdEmails.push(u.email);

  // 1. регистрация
  const userClient = createApiClient();
  await userClient.post('/auth/register', u);

  // 2. до одобрения — login падает
  const blocked = await userClient.post('/auth/login', { email: u.email, password: u.password });
  assert.equal(blocked.status, 403);

  // 3. админ одобряет
  const found = await findUserByEmail(admin, u.email);
  assert.ok(found);
  const approve = await admin.patch(`/admin/users/${found.id}/approve`, { is_approved: true });
  assert.equal(approve.status, 200);

  // 4. login теперь работает и /auth/me отдаёт пользователя
  const ok = await userClient.post('/auth/login', { email: u.email, password: u.password });
  assert.equal(ok.status, 200);
  assert.equal(ok.data.user.email, u.email);

  const me = await userClient.get('/auth/me');
  assert.equal(me.status, 200);
  assert.equal(me.data.user.email, u.email);
  assert.equal(me.data.user.role, 'user');
});