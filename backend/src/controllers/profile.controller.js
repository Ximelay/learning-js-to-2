import { pool } from '../db/pool.js';

export async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const [[user]] = await pool.query(
      'SELECT id, email, username, role, total_score, created_at FROM users WHERE id = ?',
      [userId]
    );

    const [levelProgress] = await pool.query(
      `SELECT l.id AS level_id, l.position, l.title, l.is_boss,
              (SELECT COUNT(*) FROM tasks t WHERE t.level_id = l.id) AS total_tasks,
              COALESCE(ulp.tasks_completed, 0) AS tasks_completed,
              COALESCE(ulp.is_completed, 0) AS is_completed
       FROM levels l
       LEFT JOIN user_level_progress ulp ON ulp.level_id = l.id AND ulp.user_id = ?
       ORDER BY l.position ASC`,
      [userId]
    );

    const [badges] = await pool.query(
      `SELECT b.code, b.title, b.description, b.icon, ub.awarded_at
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       WHERE ub.user_id = ?
       ORDER BY ub.awarded_at DESC`,
      [userId]
    );

    const [allBadges] = await pool.query(
      `SELECT code, title, description, icon FROM badges ORDER BY id ASC`
    );

    const [[totals]] = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM levels) AS total_levels,
         (SELECT COUNT(*) FROM tasks)  AS total_tasks,
         (SELECT COUNT(*) FROM user_task_progress WHERE user_id = ? AND status = 'completed') AS tasks_completed`,
      [userId]
    );

    const [[cert]] = await pool.query(
      'SELECT file_name, issued_at FROM certificates WHERE user_id = ? LIMIT 1',
      [userId]
    );

    res.json({
      user,
      totals,
      level_progress: levelProgress.map(l => ({ ...l, is_completed: !!l.is_completed, is_boss: !!l.is_boss })),
      badges,
      all_badges: allBadges,
      certificate: cert || null,
    });
  } catch (e) { next(e); }
}