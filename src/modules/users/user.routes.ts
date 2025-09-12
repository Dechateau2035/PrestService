import { Router } from 'express';
import { UserController } from './user.controller';
import { createUserSchema, updateUserSchema, validate } from './user.schema';

const r = Router();
/** @openapi
 * /api/users:
 *   get: { tags: [Users], summary: List users }
 *   post:
 *     tags: [Users]
 *     summary: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateUser' }
 *     responses:
 *       '201': { description: Created }
 */
r.get('/', UserController.list);
r.post('/', validate(createUserSchema), UserController.create);

/** @openapi
 * /api/users/{id}:
 *   get: { tags: [Users], summary: Get user }
 *   patch:
 *     tags: [Users]
 *     summary: Update user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateUser' }
 *   delete: { tags: [Users], summary: Delete user }
 */
r.get('/:id', UserController.get);
r.patch('/:id', validate(updateUserSchema), UserController.update);
r.delete('/:id', UserController.remove);

export default r;
