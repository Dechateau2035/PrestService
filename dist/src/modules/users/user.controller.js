"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const http_1 = require("../../common/http");
const errors_1 = require("../../common/errors");
exports.UserController = {
    list: async (_req, res) => {
        const users = await user_service_1.UserService.list();
        res.json((0, http_1.ok)(users));
    },
    get: async (req, res) => {
        const u = await user_service_1.UserService.get(req.params.id);
        if (!u)
            throw (0, errors_1.NotFound)('User not found');
        res.json((0, http_1.ok)(u));
    },
    create: async (req, res) => {
        const u = await user_service_1.UserService.create(req.validated);
        res.status(201).json((0, http_1.ok)(u));
    },
    update: async (req, res) => {
        const u = await user_service_1.UserService.update(req.params.id, req.validated);
        if (!u)
            throw (0, errors_1.NotFound)('User not found');
        res.json((0, http_1.ok)(u));
    },
    remove: async (req, res) => {
        const u = await user_service_1.UserService.remove(req.params.id);
        if (!u)
            throw (0, errors_1.NotFound)('User not found');
        res.status(204).send();
    },
};
