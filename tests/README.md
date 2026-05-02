# Тесты JS-Квеста

Покрытие: фича одобрения регистрации администратором.

| Уровень       | Файл                                              | Что проверяется |
|---------------|---------------------------------------------------|-----------------|
| Unit          | `unit/auth.schema.test.js`                        | Валидация Zod-схем `registerSchema`, `userApprovalSchema` |
| Integration   | `integration/approval-flow.test.js`               | HTTP-API: register → 403 на login → admin approve → login OK |
| UI (Selenium) | `ui/approval-flow.test.js`                        | Браузерный сценарий: экран ожидания, ошибка входа, одобрение в админке |

## Установка

```bash
cd tests
npm install
```

UI-тесты требуют установленный Chrome или Chromium. Selenium 4 умеет
автоматически скачивать совместимый chromedriver через Selenium Manager,
дополнительные действия не нужны.

## Запуск

Перед интеграционными и UI-тестами должен быть поднят стенд (из корня проекта):

```bash
npm run up:d
```

Затем:

```bash
# из каталога tests/
npm run test:unit          # юнит-тесты, БД и сеть не требуются
npm run test:integration   # стучатся в http://localhost:3000
npm run test:ui            # запускают headless Chrome против http://localhost:5173
npm test                   # все три уровня подряд
```

Полезные переменные окружения:

| Переменная       | По умолчанию              | Назначение                              |
|------------------|---------------------------|-----------------------------------------|
| `BACKEND_URL`    | `http://localhost:3000`   | URL backend для интеграции и хелперов   |
| `FRONTEND_URL`   | `http://localhost:5173`   | URL frontend для UI-тестов              |
| `ADMIN_EMAIL`    | `admin@jsquest.local`     | Логин сидового админа                   |
| `ADMIN_PASSWORD` | `admin12345`              | Пароль сидового админа                  |
| `HEADLESS`       | (включён)                 | `HEADLESS=0` — запустить Chrome с UI    |

После прогона интеграционных и UI-тестов созданные тестовые пользователи
удаляются через admin API в `after()`-хуке, поэтому таблица `users`
остаётся чистой.