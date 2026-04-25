import { pool } from '../db/pool.js';

/**
 * Пересчитывает прогресс по уровню для пользователя на основе user_task_progress.
 * Обновляет user_level_progress и возвращает {tasks_completed, total, is_completed, was_first_time}.
 */
export async function recomputeLevelProgress(userId, levelId) {
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) AS total FROM tasks WHERE level_id = ?',
    [levelId]
  );
  const [[{ done }]] = await pool.query(
    `SELECT COUNT(*) AS done
     FROM user_task_progress utp
     JOIN tasks t ON t.id = utp.task_id
     WHERE utp.user_id = ? AND t.level_id = ? AND utp.status = 'completed'`,
    [userId, levelId]
  );
  const isCompleted = total > 0 && done >= total ? 1 : 0;

  const [existing] = await pool.query(
    'SELECT id, is_completed FROM user_level_progress WHERE user_id = ? AND level_id = ? LIMIT 1',
    [userId, levelId]
  );
  let wasFirstTime = false;
  if (existing.length === 0) {
    await pool.query(
      `INSERT INTO user_level_progress (user_id, level_id, tasks_completed, is_completed, first_completed_at)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, levelId, done, isCompleted, isCompleted ? new Date() : null]
    );
    wasFirstTime = !!isCompleted;
  } else {
    const row = existing[0];
    const newlyCompleted = isCompleted && !row.is_completed;
    await pool.query(
      `UPDATE user_level_progress
       SET tasks_completed = ?, is_completed = ?, first_completed_at = COALESCE(first_completed_at, ?)
       WHERE id = ?`,
      [done, isCompleted, newlyCompleted ? new Date() : null, row.id]
    );
    wasFirstTime = newlyCompleted;
  }
  return { tasks_completed: done, total, is_completed: !!isCompleted, was_first_time: wasFirstTime };
}

/**
 * Номер следующей доступной (разблокированной) задачи для пользователя на уровне.
 * Возвращает position первой задачи со статусом не 'completed', либо null если всё решено.
 */
export async function nextUnlockedPosition(userId, levelId) {
  const [tasks] = await pool.query(
    `SELECT t.id, t.position,
            COALESCE(utp.status, 'not_started') AS status
     FROM tasks t
     LEFT JOIN user_task_progress utp
       ON utp.task_id = t.id AND utp.user_id = ?
     WHERE t.level_id = ?
     ORDER BY t.position ASC`,
    [userId, levelId]
  );
  for (const t of tasks) if (t.status !== 'completed') return t.position;
  return null;
}