import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit'; 
import { AppError } from './errors';
import { fail } from './http';

export const baseMiddlewares = [
    helmet(),
    cors({ origin: '*', credentials: false }),
    compression(),
    morgan('dev'),
    rateLimit({ windowMs: 60_000, max: 120 })
];

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
    next(new AppError(404, 'Route not found'));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.status).json(fail(err.message, err.code, err.details));
    }
    console.error(err);
    return res.status(500).json(fail('Internal Server Error'));
}
