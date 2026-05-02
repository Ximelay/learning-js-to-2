import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { ApiError } from './error.js';
import { pool } from '../db/pool.js';

export async function authRequired(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return next(new ApiError(401, 'Требуется вход в систему'));
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    // Проверяем, что пользователь не заблокирован и роль актуальна.
    const [[row]] = await pool.query(
      'SELECT id, email, username, role, is_blocked, is_approved FROM users WHERE id = ? LIMIT 1',
      [payload.sub]
    );
    if (!row) {
      res.clearCookie('token');
      return next(new ApiError(401, 'Аккаунт не найден'));
    }
    if (row.is_blocked) {
      res.clearCookie('token');
      return next(new ApiError(403, 'Аккаунт заблокирован администратором'));
    }
    if (!row.is_approved) {
      res.clearCookie('token');
      return next(new ApiError(403, 'Аккаунт ожидает одобрения администратора'));
    }
    req.user = { id: row.id, role: row.role, email: row.email, username: row.username };
    next();
  } catch (e) {
    if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Недействительный токен, войдите заново'));
    }
    next(e);
  }
}

export function adminOnly(req, _res, next) {
  if (req.user?.role !== 'admin') return next(new ApiError(403, 'Доступ только для администратора'));
  next();
}

export function authOptional(req, _res, next) {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
  } catch { /* ignore */ }
  next();
}