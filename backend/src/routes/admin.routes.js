import { Router } from 'express';
import { authRequired, adminOnly } from '../middleware/auth.js';
import { validate } from '../utils/validate.js';
import {
  adminListLevels, adminGetLevel, adminCreateLevel, adminUpdateLevel, adminDeleteLevel, levelSchema,
  adminListTasks, adminGetTask, adminCreateTask, adminUpdateTask, adminDeleteTask, taskSchema,
  adminCreateTestCase, adminUpdateTestCase, adminDeleteTestCase, testCaseSchema,
  adminListBadges, adminCreateBadge, adminUpdateBadge, adminDeleteBadge, badgeSchema,
  adminListUsers,
} from '../controllers/admin.controller.js';

const router = Router();
router.use(authRequired, adminOnly);

router.get('/levels',         adminListLevels);
router.get('/levels/:id',     adminGetLevel);
router.post('/levels',        validate(levelSchema), adminCreateLevel);
router.put('/levels/:id',     validate(levelSchema), adminUpdateLevel);
router.delete('/levels/:id',  adminDeleteLevel);

router.get('/tasks',          adminListTasks);
router.get('/tasks/:id',      adminGetTask);
router.post('/tasks',         validate(taskSchema), adminCreateTask);
router.put('/tasks/:id',      validate(taskSchema), adminUpdateTask);
router.delete('/tasks/:id',   adminDeleteTask);

router.post('/test-cases',        validate(testCaseSchema), adminCreateTestCase);
router.put('/test-cases/:id',     validate(testCaseSchema), adminUpdateTestCase);
router.delete('/test-cases/:id',  adminDeleteTestCase);

router.get('/badges',         adminListBadges);
router.post('/badges',        validate(badgeSchema), adminCreateBadge);
router.put('/badges/:id',     validate(badgeSchema), adminUpdateBadge);
router.delete('/badges/:id',  adminDeleteBadge);

router.get('/users',          adminListUsers);

export default router;