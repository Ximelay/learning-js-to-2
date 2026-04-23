-- JS-Квест: схема базы данных
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ========== Пользователи ==========
CREATE TABLE users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(191) NOT NULL,
  username      VARCHAR(64)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  total_score   INT UNSIGNED NOT NULL DEFAULT 0,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_users_email (email),
  UNIQUE KEY uniq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== Уровни (острова) ==========
CREATE TABLE levels (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  position      TINYINT UNSIGNED NOT NULL,
  title         VARCHAR(191) NOT NULL,
  subtitle      VARCHAR(255) NOT NULL DEFAULT '',
  description   TEXT         NOT NULL,
  theory_md     MEDIUMTEXT   NOT NULL,
  is_boss       TINYINT(1)   NOT NULL DEFAULT 0,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_levels_position (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== Задачи ==========
CREATE TABLE tasks (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  level_id       INT UNSIGNED NOT NULL,
  position       TINYINT UNSIGNED NOT NULL,
  title          VARCHAR(191) NOT NULL,
  description_md TEXT         NOT NULL,
  starter_code   TEXT         NOT NULL DEFAULT (''),
  solution_code  TEXT         NULL,
  points         SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_tasks_level_position (level_id, position),
  KEY idx_tasks_level (level_id),
  CONSTRAINT fk_tasks_level FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== Тест-кейсы ==========
-- Формат вызова: мы передаем solution пользователя, добавляем строку call_code,
-- ожидаем строковое представление результата равное expected_output.
-- call_code может быть, например: "JSON.stringify(solve(5))" или "sum(2,3)"
CREATE TABLE test_cases (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  task_id          INT UNSIGNED NOT NULL,
  position         TINYINT UNSIGNED NOT NULL DEFAULT 1,
  call_code        TEXT         NOT NULL,
  expected_output  TEXT         NOT NULL,
  is_hidden        TINYINT(1)   NOT NULL DEFAULT 0,
  description      VARCHAR(255) NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  KEY idx_test_cases_task (task_id),
  CONSTRAINT fk_test_cases_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== Прогресс пользователя по задачам ==========
CREATE TABLE user_task_progress (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id            INT UNSIGNED NOT NULL,
  task_id            INT UNSIGNED NOT NULL,
  status             ENUM('in_progress','completed') NOT NULL DEFAULT 'in_progress',
  attempts           INT UNSIGNED NOT NULL DEFAULT 0,
  last_code          MEDIUMTEXT   NULL,
  first_completed_at DATETIME     NULL,
  last_completed_at  DATETIME     NULL,
  updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_user_task (user_id, task_id),
  KEY idx_progress_user (user_id),
  CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_progress_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== Прогресс по уровням (денормализация для быстрых запросов) ==========
CREATE TABLE user_level_progress (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id            INT UNSIGNED NOT NULL,
  level_id           INT UNSIGNED NOT NULL,
  tasks_completed    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  is_completed       TINYINT(1) NOT NULL DEFAULT 0,
  first_completed_at DATETIME   NULL,
  updated_at         DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_user_level (user_id, level_id),
  CONSTRAINT fk_ulp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ulp_level FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== Бейджи ==========
CREATE TABLE badges (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code         VARCHAR(64)  NOT NULL,
  title        VARCHAR(191) NOT NULL,
  description  VARCHAR(500) NOT NULL,
  icon         VARCHAR(32)  NOT NULL DEFAULT '',
  -- Условие выдачи. Либо по баллам, либо по завершению конкретного уровня.
  trigger_type ENUM('score','level_complete','all_levels_complete') NOT NULL,
  trigger_value INT UNSIGNED NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_badges_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_badges (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED NOT NULL,
  badge_id    INT UNSIGNED NOT NULL,
  awarded_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_user_badge (user_id, badge_id),
  CONSTRAINT fk_ub_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_ub_badge FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== Сертификаты ==========
-- Файл лежит на диске в /app/certificates/<file_name>. В БД только метаданные.
CREATE TABLE certificates (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED NOT NULL,
  file_name   VARCHAR(191) NOT NULL,
  issued_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_cert_user (user_id),
  CONSTRAINT fk_cert_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;