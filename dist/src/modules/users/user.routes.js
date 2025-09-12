"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_schema_1 = require("./user.schema");
const r = (0, express_1.Router)();
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
r.get('/', user_controller_1.UserController.list);
r.post('/', (0, user_schema_1.validate)(user_schema_1.createUserSchema), user_controller_1.UserController.create);
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
r.get('/:id', user_controller_1.UserController.get);
r.patch('/:id', (0, user_schema_1.validate)(user_schema_1.updateUserSchema), user_controller_1.UserController.update);
r.delete('/:id', user_controller_1.UserController.remove);
exports.default = r;
