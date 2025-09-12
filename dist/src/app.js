"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./common/middlewares");
const routes_1 = __importDefault(require("./routes"));
const swagger_1 = require("./docs/swagger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
middlewares_1.baseMiddlewares.forEach(mw => exports.app.use(mw));
exports.app.get('/health', (_req, res) => res.json({ ok: true }));
exports.app.use('/api', routes_1.default);
exports.app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec)); // UI
exports.app.get('/openapi.json', (_req, res) => res.json(swagger_1.swaggerSpec)); // export JSON
exports.app.use(middlewares_1.notFoundHandler);
exports.app.use(middlewares_1.errorHandler);
