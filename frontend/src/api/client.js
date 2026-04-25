const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const err = new Error(data?.error || `Ошибка ${res.status}`);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }
  return data;
}

export const api = {
  get:   (p)    => request('GET', p),
  post:  (p, b) => request('POST', p, b),
  put:   (p, b) => request('PUT', p, b),
  patch: (p, b) => request('PATCH', p, b),
  del:   (p)    => request('DELETE', p),
};

export function certificateDownloadUrl() {
  return `${BASE}/api/certificate/download`;
}