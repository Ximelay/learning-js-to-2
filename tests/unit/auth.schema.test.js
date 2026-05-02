import test from 'node:test';
import assert from 'node:assert/strict';
import {
  registerSchema,
  loginSchema,
} from '../../backend/src/controllers/auth.controller.js';
import { userApprovalSchema } from '../../backend/src/controllers/admin.controller.js';

// ============================================================================
// Юнит-тесты — проверяют поведение чистых функций (Zod-схемы), без БД и сети.
// ============================================================================

test('registerSchema принимает корректные данные регистрации', () => {
  const input = { email: 'user@example.com', username: 'newbie', password: 'secret123' };
  const result = registerSchema.safeParse(input);
  assert.equal(result.success, true);
  assert.deepEqual(result.data, input);
});

test('registerSchema отклоняет слишком короткий пароль', () => {
  const input = { email: 'user@example.com', username: 'newbie', password: 'short' };
  const result = registerSchema.safeParse(input);
  assert.equal(result.success, false);
  // ошибка должна быть именно на поле password и содержать русское сообщение
  const passwordIssue = result.error.issues.find(i => i.path[0] === 'password');
  assert.ok(passwordIssue, 'Ожидалась ошибка по полю password');
  assert.match(passwordIssue.message, /не короче 8 символов/);
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

// Бонус: вспомогательный негативный тест login-схемы (часть схемного контракта).
// Не входит в обязательные 3, но не считается отдельным "тестом" — это часть
// первого теста? Оставляем как комментарий, в задании 3 теста — выше ровно три.
void loginSchema;