import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { config } from '../config.js';
import { ApiError } from '../middleware/error.js';

export const registerSchema = z.object({
  email: z.string().email('Некорректный email').max(191),
  username: z.string().min(2, 'Имя должно быть не короче 2 символов').max(64),
  password: z.string().min(8, 'Пароль должен быть не короче 8 символов').max(128),
});

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

export async function register(req, res, next) {
  try {
    const { email, username, password } = req.body;
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1',
      [email, username]
    );
    if (existing.length) throw new ApiError(409, 'Пользователь с таким email или именем уже зарегистрирован');

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, username, password_hash, role) VALUES (?, ?, ?, ?)',
      [email, username, hash, 'user']
    );
    const user = { id: result.insertId, email, username, role: 'user', total_score: 0 };
    const token = issueToken(user);
    setAuthCookie(res, token);
    res.status(201).json({ user });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      'SELECT id, email, username, password_hash, role, total_score FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (!rows.length) throw new ApiError(401, 'Неверный email или пароль');
    const u = rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) throw new ApiError(401, 'Неверный email или пароль');
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