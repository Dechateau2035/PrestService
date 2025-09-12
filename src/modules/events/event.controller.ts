import type { Request, Response } from 'express';
import { ok } from '../../common/http';
import { NotFound } from '../../common/errors';
import { EventService } from './event.service';

export const EventController = {
    list: async (req: Request, res: Response) => {
        const data = await EventService.list(req.q || {});
        res.json(ok(data));
    },

    get: async (req: Request, res: Response) => {
        const ev = await EventService.get(req.params.id);
        if (!ev) throw NotFound('Event not found');
        res.json(ok(ev));
    },

    create: async (req: Request, res: Response) => {
        const ev = await EventService.create(req.validated);
        res.status(201).json(ok(ev));
    },
    
    update: async (req: Request, res: Response) => {
        const ev = await EventService.update(req.params.id, req.validated);
        if (!ev) throw NotFound('Event not found');
        res.json(ok(ev));
    },
    
    updateStatus: async (req: Request, res: Response) => {
        const ev = await EventService.updateStatus(req.params.id, req.validated);
        if (!ev) throw NotFound('Event not found');
        res.json(ok(ev));
    },
    
    assignServers: async (req: Request, res: Response) => {
        const ev = await EventService.assignServers(req.params.id, req.validated);
        if (!ev) throw NotFound('Event not found');
        res.json(ok(ev));
    },
    
    remove: async (req: Request, res: Response) => {
        const ev = await EventService.remove(req.params.id);
        if (!ev) throw NotFound('Event not found');
        res.status(204).send();
    },
}