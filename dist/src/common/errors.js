"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequest = exports.NotFound = exports.AppError = void 0;
class AppError extends Error {
    constructor(status, message, code, details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}
exports.AppError = AppError;
const NotFound = (msg = 'Not found') => new AppError(404, msg);
exports.NotFound = NotFound;
const BadRequest = (msg = 'Bad request', details) => new AppError(400, msg, 'BAD_REQUEST', details);
exports.BadRequest = BadRequest;
