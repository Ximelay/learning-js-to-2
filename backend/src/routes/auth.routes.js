import { Router } from 'express';
import { validate } from '../utils/validate.js';
import { authRequired } from '../middleware/auth.js';
import { register, login, me, logout, registerSchema, loginSchema } from '../controllers/auth.controller.js';

const router = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
router.post('/logout',                             logout);
router.get('/me',        authRequired,             me);

export default router;