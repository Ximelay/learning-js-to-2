import { pool } from '../db/pool.js';
import { ApiError } from '../middleware/error.js';

export async function listLevels(req, res, next) {
  try {
    const userId = req.user?.id ?? null;
    const [levels] = await pool.query(
      `SELECT l.id, l.position, l.title, l.subtitle, l.description, l.is_boss,
              (SELECT COUNT(*) FROM tasks t WHERE t.level_id = l.id) AS total_tasks
       FROM levels l ORDER BY l.position ASC`
    );

    let progressByLevel = new Map();
    if (userId) {
      const [rows] = await pool.query(
        'SELECT level_id, tasks_completed, is_completed FROM user_level_progress WHERE user_id = ?',
        [userId]
      );
      progressByLevel = new Map(rows.map(r => [r.level_id, r]));
    }

    const out = levels.map((l, i) => {
      const prev = levels[i - 1];
      const prevDone = !prev || (progressByLevel.get(prev.id)?.is_completed === 1);
      const my = progressByLevel.get(l.id);
      return {
        id: l.id,
        position: l.position,
        title: l.title,
        subtitle: l.subtitle,
        description: l.description,
        is_boss: !!l.is_boss,
        total_tasks: l.total_tasks,
        tasks_completed: my?.tasks_completed ?? 0,
        is_completed: !!my?.is_completed,
        is_unlocked: userId ? !!prevDone : i === 0,
      };
    });
    res.json({ levels: out });
  } catch (e) { next(e); }
}

export async function getLevel(req, res, next) {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id ?? null;
    const [rows] = await pool.query(
      'SELECT id, position, title, subtitle, description, theory_md, is_boss FROM levels WHERE id = ? LIMIT 1',
      [id]
    );
    if (!rows.length) throw new ApiError(404, 'Уровень не найден');
    const level = rows[0];

    const [tasks] = await pool.query(
      `SELECT t.id, t.position, t.title, t.points,
              COALESCE(utp.status, 'not_started') AS status
       FROM tasks t
       LEFT JOIN user_task_progress utp ON utp.task_id = t.id AND utp.user_id = ?
       WHERE t.level_id = ?
       ORDER BY t.position ASC`,
      [userId, id]
    );

    // Определяем, какие задачи разблокированы (пошаговая логика)
    let unlockedUntil = 1;
    for (const t of tasks) {
      if (t.status === 'completed') unlockedUntil = Math.max(unlockedUntil, t.position + 1);
    }
    const enriched = tasks.map(t => ({
      ...t,
      is_unlocked: t.position <= unlockedUntil,
    }));

    // Проверяем, что предыдущий уровень завершён
    let prev_level_completed = true;
    if (userId && level.position > 1) {
      const [[prev]] = await pool.query(
        `SELECT ulp.is_completed
         FROM levels l
         LEFT JOIN user_level_progress ulp ON ulp.level_id = l.id AND ulp.user_id = ?
         WHERE l.position = ? LIMIT 1`,
        [userId, level.position - 1]
      );
      prev_level_completed = !!prev?.is_completed;
    }

    res.json({ level: { ...level, is_boss: !!level.is_boss }, tasks: enriched, prev_level_completed });
  } catch (e) { next(e); }
}

export async function getTask(req, res, next) {
  try {
    const taskId = Number(req.params.taskId);
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT t.id, t.level_id, t.position, t.title, t.description_md, t.starter_code, t.points,
              l.position AS level_position, l.title AS level_title
       FROM tasks t JOIN levels l ON l.id = t.level_id
       WHERE t.id = ? LIMIT 1`,
      [taskId]
    );
    if (!rows.length) throw new ApiError(404, 'Задача не найдена');
    const task = rows[0];

    // Проверяем доступ: предыдущие задачи на уровне должны быть решены
    const [prevTasks] = await pool.query(
      `SELECT t.id, t.position, COALESCE(utp.status,'not_started') AS status
       FROM tasks t
       LEFT JOIN user_task_progress utp ON utp.task_id = t.id AND utp.user_id = ?
       WHERE t.level_id = ? AND t.position < ?
       ORDER BY t.position ASC`,
      [userId, task.level_id, task.position]
    );
    const blocked = prevTasks.some(t => t.status !== 'completed');
    if (blocked) throw new ApiError(403, 'Сначала решите предыдущие задачи этого уровня');

    // Публичные (нескрытые) тест-кейсы — только для примера
    const [visibleCases] = await pool.query(
      `SELECT id, call_code, expected_output, description
       FROM test_cases WHERE task_id = ? AND is_hidden = 0 ORDER BY position ASC LIMIT 2`,
      [taskId]
    );

    const [existing] = await pool.query(
      'SELECT last_code, status, attempts FROM user_task_progress WHERE user_id = ? AND task_id = ? LIMIT 1',
      [userId, taskId]
    );
    const mine = existing[0] || { last_code: null, status: 'not_started', attempts: 0 };

    res.json({
      task: { ...task, starter_code: task.starter_code ?? '' },
      visible_tests: visibleCases,
      my_progress: mine,
    });
  } catch (e) { next(e); }
}