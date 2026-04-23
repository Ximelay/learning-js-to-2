# JS-Квест — Острова JavaScript

Образовательный веб-квест для изучения синтаксиса JavaScript. Gamified-платформа с 9 «островами» (уровнями), теорией, редактором кода, автоматической проверкой задач, системой бейджей и PDF-сертификатом по завершении курса.

## Стек

- **Frontend:** React 18 + Vite, CodeMirror 6, React Router
- **Backend:** Node.js + Express, JWT в httpOnly-cookie
- **БД:** MySQL 8
- **Песочница проверки кода:** `isolated-vm` (V8-изоляты внутри контейнера бэкенда)
- **PDF-сертификаты:** `pdfkit`, файлы лежат в `backend/certificates/`
- **Оркестрация:** Docker + docker-compose

## Структура проекта

```
website-yana/
├── docker-compose.yml
├── .env                          — секреты и порты
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── index.js              — точка входа
│       ├── config.js
│       ├── db/                   — пул соединений, админ-сид
│       ├── middleware/           — auth, error, валидация
│       ├── controllers/          — auth, levels, submit, profile, certificate, admin
│       ├── routes/               — auth, api, admin
│       ├── services/             — sandbox (isolated-vm), errorMap, progress, badges, certificate
│       └── seeds/                — content.js (все 9 уровней × 5 задач)
├── frontend/
│   ├── Dockerfile
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api/client.js
│       ├── context/AuthContext.jsx
│       ├── components/           — Layout, Markdown
│       ├── pages/                — Login, Register, Islands, Level, Task, Profile, Admin...
│       └── styles/global.css
└── database/
    └── init/
        ├── 01-schema.sql         — автоматически применяется при первом запуске mysql
```

## Запуск

1. Убедитесь, что установлены Docker и docker-compose.
2. Из корня проекта:
   ```bash
   docker compose --env-file .env up --build
   ```
   или короче:
   ```bash
   npm run up
   ```
3. Дождитесь, пока backend напишет `Backend слушает порт 3000`. При первом запуске:
   - MySQL создаст базу и применит `01-schema.sql` + `02-seed-badges.sql`
   - Backend создаст аккаунт администратора и засеет весь контент курса (9 уровней × 5 задач)

## Точки входа

- **Фронтенд:** http://localhost:5173
- **API:** http://localhost:3000 (эндпоинт здоровья: `/health`)
- **Adminer (веб-клиент БД):** http://localhost:8080 — Server: `mysql`, User: `jsquest`, Password: `jsquestpass`, Database: `jsquest`

## Учётные данные по умолчанию

- **Админ:** `admin@jsquest.local` / `admin12345`
  - Задаётся в `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
  - Смените пароль после первого запуска

## Скрипты npm (в корне)

```bash
npm run up         # поднять весь стек (с билдом)
npm run up:d       # то же, в фоне
npm run down       # остановить
npm run logs       # логи всех сервисов
npm run logs:backend
npm run db:shell   # открыть mysql shell внутри контейнера
npm run reset      # полный сброс: удалить volumes и поднять заново
```

## Как устроена проверка кода

Пользовательский код запускается в **отдельной V8-изоляте** (`isolated-vm`) внутри backend-контейнера:
- Лимит памяти: 64 МБ
- Таймаут выполнения: 2 секунды
- Никакого доступа к Node API, файловой системе, сети, `setTimeout`/`setInterval`
- `console.log` перехватывается и возвращается пользователю в ответе

Тест-кейс — пара `{ call_code, expected_output }`. Например:
```
call_code:        "sum(2, 3)"
expected_output:  "5"
```
Движок выполняет код пользователя, затем вычисляет `call_code`, сериализует результат (через `JSON.stringify` для объектов/массивов) и сравнивает со строкой `expected_output`.

Ошибки (SyntaxError/ReferenceError/TypeError и т.д.) маппятся в русские сообщения через `services/errorMap.js`.

## Маршруты API

### Auth
- `POST /auth/register` — `{ email, username, password }`
- `POST /auth/login` — `{ email, password }`
- `POST /auth/logout`
- `GET /auth/me`

### Публичные/пользовательские
- `GET /api/levels` — карта островов с прогрессом (если авторизован)
- `GET /api/levels/:id` — уровень с теорией и списком задач
- `GET /api/tasks/:taskId` — задача (проверяет разблокировку)
- `POST /api/tasks/:taskId/submit` — `{ code }` — проверить решение
- `GET /api/profile` — профиль, прогресс, бейджи, статус сертификата
- `POST /api/certificate/issue` — выпустить сертификат (только если все уровни пройдены)
- `GET /api/certificate/download` — скачать PDF

### Админ (только `role = admin`)
- `GET|POST|PUT|DELETE /admin/levels[/:id]`
- `GET|POST|PUT|DELETE /admin/tasks[/:id]` (поддерживает `?level_id=...`)
- `POST|PUT|DELETE /admin/test-cases[/:id]`
- `GET|POST|PUT|DELETE /admin/badges[/:id]`
- `GET /admin/users`

## База данных — ключевые таблицы

- `users` — логин, хэш пароля, роль, total_score
- `levels`, `tasks`, `test_cases`, `theory` встроена в `levels.theory_md`
- `user_task_progress` — статус каждой задачи для каждого пользователя
- `user_level_progress` — денормализованный прогресс по уровню
- `badges`, `user_badges`
- `certificates` — только метаданные (имя файла), сам PDF в `backend/certificates/`

## Контент курса (9 островов × 5 задач)

1. Переменные и типы данных
2. Условные конструкции
3. Циклы
4. Функции
5. Массивы
6. Объекты
7. DOM (работа с мок-структурами `{tag, text, attrs, children}`)
8. События (обработчики как чистые функции)
9. 👑 Финальный босс — интеграционные задачи со всеми темами

Контент засевается из `backend/src/seeds/content.js`. Через админку можно добавлять/редактировать/удалять — БД является источником истины. Засев запускается только один раз, при пустой таблице `levels`.

## Бейджи

Выдаются автоматически после каждой проверенной задачи. Три типа условий:
- `score` — набрать N баллов
- `level_complete` — пройти конкретный уровень (по ID)
- `all_levels_complete` — пройти все

Начальный набор (11 бейджей) задан в `database/init/02-seed-badges.sql`. Админ может создавать новые прямо из панели.

## Сертификат

- Доступен после прохождения всех 9 островов
- PDF (ландшафт A4) генерируется через `pdfkit`
- Файл сохраняется в `backend/certificates/` (примонтированный volume)
- Скачивается по `/api/certificate/download`
- В БД хранится только имя файла

## Безопасность

- Пароли: bcrypt с cost=10
- JWT: httpOnly cookie, SameSite=Lax, секрет из `.env`
- Валидация входных данных: Zod-схемы в каждом контроллере
- CORS с whitelisted origin и `credentials: true`
- Песочница: V8-изолят с жёсткими лимитами памяти и времени
- Тест-кейсы с флагом `is_hidden` не показываются пользователю в деталях

## Локальная разработка без Docker (опционально)

1. Поднять MySQL любым способом, применить `database/init/01-schema.sql` и `02-seed-badges.sql`.
2. `cd backend && npm install && npm run dev`
3. `cd frontend && npm install && npm run dev`
4. В `.env` установить `DB_HOST=127.0.0.1`.

⚠️ Для `isolated-vm` на macOS может понадобиться Xcode Command Line Tools (`xcode-select --install`), а также Python и C++-компилятор.

## Тестовый сценарий

1. Откройте http://localhost:5173
2. Зарегистрируйтесь (например, `user@test.local` / `12345678`)
3. Откройте первый остров — прочитайте теорию, решите все 5 задач
4. Получите бейдж «Господин Const» после завершения острова 1
5. Пройдите все 9 островов → получите бейдж «Асинхронный Волшебник»
6. В личном кабинете нажмите «Получить сертификат» → скачайте PDF
7. Войдите как админ (`admin@jsquest.local` / `admin12345`) → вкладка **Админка**: редактируйте контент, смотрите пользователей

## Траблшутинг

- **Backend не стартует с ошибкой `isolated-vm`** — пересоберите: `docker compose build --no-cache backend`
- **MySQL не поднимается** — удалите volume: `docker compose down -v && docker compose up --build`
- **Frontend не видит бэкенд** — проверьте, что `VITE_API_URL` в `.env` совпадает с реальным адресом backend
- **Ошибка CORS** — убедитесь что `FRONTEND_ORIGIN` в `.env` совпадает с адресом фронта