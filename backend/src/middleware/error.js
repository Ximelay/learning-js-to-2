export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function notFound(_req, _res, next) {
  next(new ApiError(404, 'Маршрут не найден'));
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const payload = { error: err.message || 'Внутренняя ошибка сервера' };
  if (err.details) payload.details = err.details;
  if (status >= 500) console.error('[error]', err);
  res.status(status).json(payload);
}