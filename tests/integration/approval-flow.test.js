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
  for (const email of createdEmails) {
    try { await deleteUserByEmail(admin, email); } catch { /* ignore */ }
  }
});

test('POST /admin/users без авторизации админа отклоняется', async () => {
  const u = uniqueUser('anon');
  const anon = createApiClient();
  const res = await anon.post('/admin/users', { email: u.email, username: u.username });
  // authRequired срабатывает первым → 401
  assert.equal(res.status, 401);
});

test('POST /admin/users создаёт одобренного пользователя и возвращает сгенерированный пароль', async () => {
  const u = uniqueUser('create');
  createdEmails.push(u.email);
  const res = await admin.post('/admin/users', { email: u.email, username: u.username });

  assert.equal(res.status, 201);
  assert.equal(res.data.user.email, u.email);
  assert.equal(res.data.user.username, u.username);
  assert.equal(res.data.user.role, 'user');
  assert.equal(res.data.user.is_approved, true);
  assert.equal(typeof res.data.password, 'string');
  assert.ok(res.data.password.length >= 12, 'Пароль должен быть не короче 12 символов');

  // в админ-списке он виден сразу как одобренный
  const found = await findUserByEmail(admin, u.email);
  assert.ok(found);
  assert.equal(found.is_approved, true);
});

test('Созданный админом пользователь может сразу войти со сгенерированным паролем', async () => {
  const u = uniqueUser('login');
  createdEmails.push(u.email);

  const created = await admin.post('/admin/users', { email: u.email, username: u.username });
  assert.equal(created.status, 201);
  const generatedPassword = created.data.password;

  const userClient = createApiClient();
  const ok = await userClient.post('/auth/login', { email: u.email, password: generatedPassword });
  assert.equal(ok.status, 200);
  assert.equal(ok.data.user.email, u.email);

  const me = await userClient.get('/auth/me');
  assert.equal(me.status, 200);
  assert.equal(me.data.user.email, u.email);
  assert.equal(me.data.user.role, 'user');
});

test('POST /admin/users отклоняет дубликат email с 409', async () => {
  const u = uniqueUser('dup');
  createdEmails.push(u.email);

  const first = await admin.post('/admin/users', { email: u.email, username: u.username });
  assert.equal(first.status, 201);

  const dup = await admin.post('/admin/users', { email: u.email, username: u.username + '_2' });
  assert.equal(dup.status, 409);
  assert.match(dup.data.error, /уже существует/i);
});

test('POST /auth/register больше не существует (404)', async () => {
  const client = createApiClient();
  const res = await client.post('/auth/register', { email: 'x@y.z', username: 'x', password: '12345678' });
  assert.equal(res.status, 404);
});