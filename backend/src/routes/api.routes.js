import { Router } from 'express';
import { authRequired, authOptional } from '../middleware/auth.js';
import { validate } from '../utils/validate.js';
import { listLevels, getLevel, getTask } from '../controllers/levels.controller.js';
import { submitSolution, submitSchema } from '../controllers/submit.controller.js';
import { getProfile } from '../controllers/profile.controller.js';
import { issueCertificate, downloadCertificate } from '../controllers/certificate.controller.js';

const router = Router();

router.get('/levels',               authOptional, listLevels);
router.get('/levels/:id',           authOptional, getLevel);

router.get('/tasks/:taskId',        authRequired, getTask);
router.post('/tasks/:taskId/submit', authRequired, validate(submitSchema), submitSolution);

router.get('/profile',              authRequired, getProfile);

router.post('/certificate/issue',   authRequired, issueCertificate);
router.get('/certificate/download', authRequired, downloadCertificate);

export default router;