import { BACKEND_URL, ADMIN_EMAIL, ADMIN_PASSWORD } from './env.js';

// Минимальный fetch-клиент с поддержкой кук — нужен потому что бекенд
// выдаёт сессию через httpOnly cookie. Сохраняем заголовок Set-Cookie между запросами.
export function createApiClient() {
  let cookie = '';

  async function request(method, path, body) {
    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (cookie) headers['Cookie'] = cookie;

    const res = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      // node fetch объединяет несколько Set-Cookie в одну строку; нам достаточно "token=..."
      const tokenPart = setCookie.split(',').map(s => s.trim()).find(s => s.startsWith('token='));
      if (tokenPart) cookie = tokenPart.split(';')[0];
    }
    let data = null;
    if (res.headers.get('content-type')?.includes('application/json')) {
      data = await res.json();
    }
    return { status: res.status, data, raw: res };
  }

  return {
    get:    (p)    => request('GET', p),
    post:   (p, b) => request('POST', p, b),
    patch:  (p, b) => request('PATCH', p, b),
    del:    (p)    => request('DELETE', p),
    cookie: () => cookie,
    clearCookie: () => { cookie = ''; },
  };
}

export async function loginAsAdmin(client = createApiClient()) {
  const r = await client.post('/auth/login', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (r.status !== 200) {
    throw new Error(`Не удалось войти под админом: ${r.status} ${JSON.stringify(r.data)}`);
  }
  return client;
}

export async function findUserByEmail(adminClient, email) {
  const r = await adminClient.get('/admin/users');
  if (r.status !== 200) throw new Error(`GET /admin/users: ${r.status}`);
  return r.data.users.find(u => u.email === email) || null;
}

export async function deleteUserByEmail(adminClient, email) {
  const u = await findUserByEmail(adminClient, email);
  if (!u) return false;
  const r = await adminClient.del(`/admin/users/${u.id}`);
  return r.status === 200;
}