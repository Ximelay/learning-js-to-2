import { pool } from './pool.js';

/**
 * Идемпотентные миграции, запускаются при каждом старте.
 * Добавляют отсутствующие колонки/индексы, не трогая существующие данные.
 */
export async function runMigrations() {
  await addColumnIfMissing('users', 'is_blocked', 'TINYINT(1) NOT NULL DEFAULT 0');
}

async function addColumnIfMissing(table, column, definition) {
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  if (rows.length) return;
  await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
  console.log(`[migration] Добавлена колонка ${table}.${column}`);
}