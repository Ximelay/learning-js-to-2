import { z } from 'zod';
import { pool } from '../db/pool.js';
import { ApiError } from '../middleware/error.js';
import { runAll } from '../services/sandbox.js';
import { recomputeLevelProgress } from '../services/progress.js';
import { awardBadgesForUser } from '../services/badges.js';

export const submitSchema = z.object({
  code: z.string().min(1, 'Код решения не может быть пустым').max(20000, 'Код слишком длинный'),
});

export async function submitSolution(req, res, next) {
  try {
    const taskId = Number(req.params.taskId);
    const userId = req.user.id;
    const { code } = req.body;

    const [rows] = await pool.query(
      `SELECT t.id, t.level_id, t.position, t.points
       FROM tasks t WHERE t.id = ? LIMIT 1`,
      [taskId]
    );
    if (!rows.length) throw new ApiError(404, 'Задача не найдена');
    const task = rows[0];

    // Блокировка: решены ли предыдущие задачи уровня
    const [prevTasks] = await pool.query(
      `SELECT COALESCE(utp.status,'not_started') AS status
       FROM tasks t
       LEFT JOIN user_task_progress utp ON utp.task_id = t.id AND utp.user_id = ?
       WHERE t.level_id = ? AND t.position < ?`,
      [userId, task.level_id, task.position]
    );
    if (prevTasks.some(t => t.status !== 'completed')) {
      throw new ApiError(403, 'Сначала решите предыдущие задачи этого уровня');
    }

    const [testCases] = await pool.query(
      'SELECT id, call_code, expected_output, description, is_hidden FROM test_cases WHERE task_id = ? ORDER BY position ASC',
      [taskId]
    );
    if (!testCases.length) throw new ApiError(500, 'Для этой задачи ещё не заданы проверки');

    const { allPassed, results } = await runAll(code, testCases);

    // Определяем, было ли решение первым успешным
    const [existingRows] = await pool.query(
      'SELECT id, status, attempts FROM user_task_progress WHERE user_id = ? AND task_id = ? LIMIT 1',
      [userId, taskId]
    );
    const existing = existingRows[0];
    const alreadyCompleted = existing?.status === 'completed';

    if (existing) {
      await pool.query(
        `UPDATE user_task_progress
         SET attempts = attempts + 1,
             last_code = ?,
             status = CASE WHEN ? = 1 THEN 'completed' ELSE status END,
             first_completed_at = COALESCE(first_completed_at, ?),
             last_completed_at  = CASE WHEN ? = 1 THEN NOW() ELSE last_completed_at END
         WHERE id = ?`,
        [code, allPassed ? 1 : 0, allPassed ? new Date() : null, allPassed ? 1 : 0, existing.id]
      );
    } else {
      await pool.query(
        `INSERT INTO user_task_progress
           (user_id, task_id, status, attempts, last_code, first_completed_at, last_completed_at)
         VALUES (?, ?, ?, 1, ?, ?, ?)`,
        [userId, taskId, allPassed ? 'completed' : 'in_progress', code,
         allPassed ? new Date() : null, allPassed ? new Date() : null]
      );
    }

    // Начисляем баллы только при ПЕРВОМ успешном прохождении
    let earnedPoints = 0;
    if (allPassed && !alreadyCompleted) {
      earnedPoints = task.points;
      await pool.query('UPDATE users SET total_score = total_score + ? WHERE id = ?', [earnedPoints, userId]);
    }

    // Пересчёт прогресса уровня и выдача бейджей
    let levelProgress = null;
    let newBadges = [];
    if (allPassed) {
      levelProgress = await recomputeLevelProgress(userId, task.level_id);
      newBadges = await awardBadgesForUser(userId);
    }

    // Скрываем call_code у скрытых тест-кейсов в ответе
    const publicResults = results.map(r => ({
      test_id: r.test_id,
      description: r.description,
      passed: r.passed,
      is_hidden: r.is_hidden,
      expected: r.is_hidden ? undefined : r.expected,
      actual:   r.is_hidden ? undefined : r.actual,
      error: r.error,
      logs: r.logs,
    }));

    res.json({
      passed: allPassed,
      results: publicResults,
      earned_points: earnedPoints,
      already_completed: alreadyCompleted,
      level_progress: levelProgress,
      new_badges: newBadges,
    });
  } catch (e) { next(e); }
}