import type { Request, Response } from 'express';
import { UserService } from './user.service';
import { ok } from '../../common/http';
import { NotFound } from '../../common/errors';

export const UserController = {
    list: async (_req: Request, res: Response) => {
        const users = await UserService.list();
        res.json(ok(users));
    },
    get: async (req: Request, res: Response) => {
        const u = await UserService.get(req.params.id); 
        if (!u) throw NotFound('User not found');
        res.json(ok(u));
    },
    create: async (req: Request, res: Response) => {
        const u = await UserService.create(req.validated);
        res.status(201).json(ok(u));
    },
    update: async (req: Request, res: Response) => {
        const u = await UserService.update(req.params.id, req.validated); 
        if (!u) throw NotFound('User not found');
        res.json(ok(u));
    },
    remove: async (req: Request, res: Response) => {
        const u = await UserService.remove(req.params.id);
        if (!u) throw NotFound('User not found');
        res.status(204).send();
    },
};
