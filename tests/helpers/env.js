// Общие настройки для всех видов тестов.
// Хост/порты можно переопределить переменными окружения, чтобы запускать
// тесты против другого стенда (например, в CI).

export const BACKEND_URL = process.env.BACKEND_URL
export const FRONTEND_URL = process.env.FRONTEND_URL
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export function uniqueUser(prefix = 'test') {
  const tag = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  return {
    email: `${prefix}_${tag}@jsquest.test`,
    username: `${prefix}_${tag}`.slice(0, 60),
    password: 'pass123456',
  };
}