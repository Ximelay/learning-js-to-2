import { ApiError } from '../middleware/error.js';

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }));
      return next(new ApiError(400, 'Некорректные данные запроса', details));
    }
    req.body = result.data;
    next();
  };
}