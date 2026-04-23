import { z } from 'zod';
import { pool } from '../db/pool.js';
import { ApiError } from '../middleware/error.js';

// ========== Схемы валидации ==========

export const levelSchema = z.object({
  position: z.number().int().min(1).max(99),
  title: z.string().min(1).max(191),
  subtitle: z.string().max(255).default(''),
  description: z.string().min(1),
  theory_md: z.string().default(''),
  is_boss: z.boolean().default(false),
});

export const taskSchema = z.object({
  level_id: z.number().int().min(1),
  position: z.number().int().min(1).max(99),
  title: z.string().min(1).max(191),
  description_md: z.string().min(1),
  starter_code: z.string().default(''),
  solution_code: z.string().optional().nullable(),
  points: z.number().int().min(0).max(10000).default(10),
});

export const testCaseSchema = z.object({
  task_id: z.number().int().min(1),
  position: z.number().int().min(1).max(99).default(1),
  call_code: z.string().min(1),
  expected_output: z.string(),
  is_hidden: z.boolean().default(false),
  description: z.string().max(255).default(''),
});

export const badgeSchema = z.object({
  code: z.string().min(1).max(64),
  title: z.string().min(1).max(191),
  description: z.string().max(500),
  icon: z.string().max(32).default(''),
  trigger_type: z.enum(['score', 'level_complete', 'all_levels_complete']),
  trigger_value: z.number().int().nullable().optional(),
});

// ========== LEVELS ==========

export async function adminListLevels(_req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, (SELECT COUNT(*) FROM tasks t WHERE t.level_id = l.id) AS tasks_count
       FROM levels l ORDER BY position ASC`
    );
    res.json({ levels: rows.map(r => ({ ...r, is_boss: !!r.is_boss })) });
  } catch (e) { next(e); }
}

export async function adminGetLevel(req, res, next) {
  try {
    const [[row]] = await pool.query('SELECT * FROM levels WHERE id = ?', [req.params.id]);
    if (!row) throw new ApiError(404, 'Уровень не найден');
    res.json({ level: { ...row, is_boss: !!row.is_boss } });
  } catch (e) { next(e); }
}

export async function adminCreateLevel(req, res, next) {
  try {
    const d = req.body;
    const [r] = await pool.query(
      `INSERT INTO levels (position, title, subtitle, description, theory_md, is_boss)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [d.position, d.title, d.subtitle, d.description, d.theory_md, d.is_boss ? 1 : 0]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) { next(e); }
}

export async function adminUpdateLevel(req, res, next) {
  try {
    const d = req.body;
    const [r] = await pool.query(
      `UPDATE levels SET position=?, title=?, subtitle=?, description=?, theory_md=?, is_boss=?
       WHERE id=?`,
      [d.position, d.title, d.subtitle, d.description, d.theory_md, d.is_boss ? 1 : 0, req.params.id]
    );
    if (!r.affectedRows) throw new ApiError(404, 'Уровень не найден');
    res.json({ ok: true });
  } catch (e) { next(e); }
}

export async function adminDeleteLevel(req, res, next) {
  try {
    await pool.query('DELETE FROM levels WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
}

// ========== TASKS ==========

export async function adminListTasks(req, res, next) {
  try {
    const levelId = req.query.level_id ? Number(req.query.level_id) : null;
    const sql = `SELECT t.*, (SELECT COUNT(*) FROM test_cases tc WHERE tc.task_id = t.id) AS tests_count
                 FROM tasks t ${levelId ? 'WHERE t.level_id = ?' : ''} ORDER BY t.level_id, t.position`;
    const [rows] = await pool.query(sql, levelId ? [levelId] : []);
    res.json({ tasks: rows });
  } catch (e) { next(e); }
}

export async function adminGetTask(req, res, next) {
  try {
    const [[task]] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!task) throw new ApiError(404, 'Задача не найдена');
    const [tests] = await pool.query(
      'SELECT * FROM test_cases WHERE task_id = ? ORDER BY position', [task.id]
    );
    res.json({ task, test_cases: tests.map(t => ({ ...t, is_hidden: !!t.is_hidden })) });
  } catch (e) { next(e); }
}

export async function adminCreateTask(req, res, next) {
  try {
    const d = req.body;
    const [r] = await pool.query(
      `INSERT INTO tasks (level_id, position, title, description_md, starter_code, solution_code, points)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [d.level_id, d.position, d.title, d.description_md, d.starter_code, d.solution_code ?? null, d.points]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) { next(e); }
}

export async function adminUpdateTask(req, res, next) {
  try {
    const d = req.body;
    const [r] = await pool.query(
      `UPDATE tasks SET level_id=?, position=?, title=?, description_md=?, starter_code=?, solution_code=?, points=?
       WHERE id=?`,
      [d.level_id, d.position, d.title, d.description_md, d.starter_code, d.solution_code ?? null, d.points, req.params.id]
    );
    if (!r.affectedRows) throw new ApiError(404, 'Задача не найдена');
    res.json({ ok: true });
  } catch (e) { next(e); }
}

export async function adminDeleteTask(req, res, next) {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
}

// ========== TEST CASES ==========

export async function adminCreateTestCase(req, res, next) {
  try {
    const d = req.body;
    const [r] = await pool.query(
      `INSERT INTO test_cases (task_id, position, call_code, expected_output, is_hidden, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [d.task_id, d.position, d.call_code, d.expected_output, d.is_hidden ? 1 : 0, d.description]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) { next(e); }
}

export async function adminUpdateTestCase(req, res, next) {
  try {
    const d = req.body;
    const [r] = await pool.query(
      `UPDATE test_cases SET task_id=?, position=?, call_code=?, expected_output=?, is_hidden=?, description=?
       WHERE id=?`,
      [d.task_id, d.position, d.call_code, d.expected_output, d.is_hidden ? 1 : 0, d.description, req.params.id]
    );
    if (!r.affectedRows) throw new ApiError(404, 'Тест-кейс не найден');
    res.json({ ok: true });
  } catch (e) { next(e); }
}

export async function adminDeleteTestCase(req, res, next) {
  try {
    await pool.query('DELETE FROM test_cases WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
}

// ========== BADGES ==========

export async function adminListBadges(_req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM badges ORDER BY id');
    res.json({ badges: rows });
  } catch (e) { next(e); }
}

export async function adminCreateBadge(req, res, next) {
  try {
    const d = req.body;
    const [r] = await pool.query(
      `INSERT INTO badges (code, title, description, icon, trigger_type, trigger_value)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [d.code, d.title, d.description, d.icon, d.trigger_type, d.trigger_value ?? null]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) { next(e); }
}

export async function adminUpdateBadge(req, res, next) {
  try {
    const d = req.body;
    const [r] = await pool.query(
      `UPDATE badges SET code=?, title=?, description=?, icon=?, trigger_type=?, trigger_value=?
       WHERE id=?`,
      [d.code, d.title, d.description, d.icon, d.trigger_type, d.trigger_value ?? null, req.params.id]
    );
    if (!r.affectedRows) throw new ApiError(404, 'Бейдж не найден');
    res.json({ ok: true });
  } catch (e) { next(e); }
}

export async function adminDeleteBadge(req, res, next) {
  try {
    await pool.query('DELETE FROM badges WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
}

// ========== USERS ==========

export async function adminListUsers(_req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, username, role, total_score, created_at,
              (SELECT COUNT(*) FROM user_task_progress utp WHERE utp.user_id = users.id AND utp.status = 'completed') AS tasks_completed
       FROM users ORDER BY created_at DESC`
    );
    res.json({ users: rows });
  } catch (e) { next(e); }
}