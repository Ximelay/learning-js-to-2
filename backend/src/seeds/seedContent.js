import { pool } from '../db/pool.js';
import { LEVELS } from './content.js';

/**
 * Засевает контент (уровни + задачи + тест-кейсы) только если таблица levels пуста.
 * Если уровни уже есть — ничего не делает (чтобы не перетирать данные админки).
 */
export async function seedContentIfEmpty() {
  const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM levels');
  if (c > 0) return;

  console.log('[seed] Засеваю контент курса...');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const L of LEVELS) {
      const [lvlRes] = await conn.query(
        `INSERT INTO levels (position, title, subtitle, description, theory_md, is_boss)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [L.position, L.title, L.subtitle, L.description, L.theory_md, L.is_boss ? 1 : 0]
      );
      const levelId = lvlRes.insertId;

      for (const T of L.tasks) {
        const [tRes] = await conn.query(
          `INSERT INTO tasks (level_id, position, title, description_md, starter_code, solution_code, points)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [levelId, T.position, T.title, T.description_md, T.starter_code, T.solution_code ?? null, T.points]
        );
        const taskId = tRes.insertId;

        let pos = 1;
        for (const TC of T.test_cases) {
          await conn.query(
            `INSERT INTO test_cases (task_id, position, call_code, expected_output, is_hidden, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [taskId, pos++, TC.call_code, TC.expected_output, TC.is_hidden ? 1 : 0, TC.description || '']
          );
        }
      }
    }
    await conn.commit();
    console.log(`[seed] Засеяно уровней: ${LEVELS.length}`);
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}