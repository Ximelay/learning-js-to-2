import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { config } from '../config.js';
import { ApiError } from '../middleware/error.js';

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

function issueToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.nodeEnv === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      'SELECT id, email, username, password_hash, role, total_score, is_blocked, is_approved FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (!rows.length) throw new ApiError(401, 'Неверный email или пароль');
    const u = rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) throw new ApiError(401, 'Неверный email или пароль');
    if (u.is_blocked) throw new ApiError(403, 'Аккаунт заблокирован администратором');
    if (!u.is_approved) throw new ApiError(403, 'Аккаунт ожидает одобрения администратора');
    const user = { id: u.id, email: u.email, username: u.username, role: u.role, total_score: u.total_score };
    setAuthCookie(res, issueToken(user));
    res.json({ user });
  } catch (e) { next(e); }
}

export async function me(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, username, role, total_score, created_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );
    if (!rows.length) throw new ApiError(401, 'Пользователь не найден');
    res.json({ user: rows[0] });
  } catch (e) { next(e); }
}

export function logout(_req, res) {
  res.clearCookie('token');
  res.json({ ok: true });
}