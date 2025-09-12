"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseMiddlewares = void 0;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errors_1 = require("./errors");
const http_1 = require("./http");
exports.baseMiddlewares = [
    (0, helmet_1.default)(),
    (0, cors_1.default)({ origin: '*', credentials: false }),
    (0, compression_1.default)(),
    (0, morgan_1.default)('dev'),
    (0, express_rate_limit_1.default)({ windowMs: 60_000, max: 120 })
];
function notFoundHandler(_req, _res, next) {
    next(new errors_1.AppError(404, 'Route not found'));
}
function errorHandler(err, _req, res, _next) {
    if (err instanceof errors_1.AppError) {
        return res.status(err.status).json((0, http_1.fail)(err.message, err.code, err.details));
    }
    console.error(err);
    return res.status(500).json((0, http_1.fail)('Internal Server Error'));
}
