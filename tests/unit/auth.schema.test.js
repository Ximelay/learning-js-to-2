import test from 'node:test';
import assert from 'node:assert/strict';
import { loginSchema } from '../../backend/src/controllers/auth.controller.js';
import {
  userCreateSchema,
  userApprovalSchema,
} from '../../backend/src/controllers/admin.controller.js';

// ============================================================================
// Юнит-тесты — проверяют поведение чистых функций (Zod-схемы), без БД и сети.
// ============================================================================

test('userCreateSchema принимает корректные данные и подставляет роль user по умолчанию', () => {
  const input = { email: 'student@example.com', username: 'newbie' };
  const result = userCreateSchema.safeParse(input);
  assert.equal(result.success, true);
  assert.deepEqual(result.data, { ...input, role: 'user' });
});

test('userCreateSchema отклоняет некорректный email', () => {
  const input = { email: 'not-an-email', username: 'newbie' };
  const result = userCreateSchema.safeParse(input);
  assert.equal(result.success, false);
  const emailIssue = result.error.issues.find(i => i.path[0] === 'email');
  assert.ok(emailIssue, 'Ожидалась ошибка по полю email');
  assert.match(emailIssue.message, /Некорректный email/);
});

test('userApprovalSchema требует boolean is_approved', () => {
  // boolean — ок
  assert.equal(userApprovalSchema.safeParse({ is_approved: true }).success, true);
  assert.equal(userApprovalSchema.safeParse({ is_approved: false }).success, true);
  // строка вместо boolean — нет
  assert.equal(userApprovalSchema.safeParse({ is_approved: 'yes' }).success, false);
  // отсутствует поле — нет
  assert.equal(userApprovalSchema.safeParse({}).success, false);
});

// loginSchema — часть контракта auth, проверяем что schema импортируется
void loginSchema;