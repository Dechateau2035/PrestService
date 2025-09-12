export class AppError extends Error {
    status: number; code?: string; details?: unknown;
    constructor(status: number, message: string, code?: string, details?: unknown) {
        super(message); this.status = status; this.code = code; this.details = details;
    }
}

export const NotFound = (msg = 'Not found') => new AppError(404, msg);

export const BadRequest = (msg = 'Bad request', details?: unknown) => new AppError(400, msg, 'BAD_REQUEST', details);
