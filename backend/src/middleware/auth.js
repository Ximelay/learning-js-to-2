import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { ApiError } from './error.js';

export function authRequired(req, _res, next) {
  const token = req.cookies?.token;
  if (!token) return next(new ApiError(401, 'Требуется вход в систему'));
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    next(new ApiError(401, 'Недействительный токен, войдите заново'));
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