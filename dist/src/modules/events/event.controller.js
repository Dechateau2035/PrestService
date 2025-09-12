"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const http_1 = require("../../common/http");
const errors_1 = require("../../common/errors");
const event_service_1 = require("./event.service");
exports.EventController = {
    list: async (req, res) => {
        const data = await event_service_1.EventService.list(req.q || {});
        res.json((0, http_1.ok)(data));
    },
    get: async (req, res) => {
        const ev = await event_service_1.EventService.get(req.params.id);
        if (!ev)
            throw (0, errors_1.NotFound)('Event not found');
        res.json((0, http_1.ok)(ev));
    },
    create: async (req, res) => {
        const ev = await event_service_1.EventService.create(req.validated);
        res.status(201).json((0, http_1.ok)(ev));
    },
    update: async (req, res) => {
        const ev = await event_service_1.EventService.update(req.params.id, req.validated);
        if (!ev)
            throw (0, errors_1.NotFound)('Event not found');
        res.json((0, http_1.ok)(ev));
    },
    updateStatus: async (req, res) => {
        const ev = await event_service_1.EventService.updateStatus(req.params.id, req.validated);
        if (!ev)
            throw (0, errors_1.NotFound)('Event not found');
        res.json((0, http_1.ok)(ev));
    },
    assignServers: async (req, res) => {
        const ev = await event_service_1.EventService.assignServers(req.params.id, req.validated);
        if (!ev)
            throw (0, errors_1.NotFound)('Event not found');
        res.json((0, http_1.ok)(ev));
    },
    remove: async (req, res) => {
        const ev = await event_service_1.EventService.remove(req.params.id);
        if (!ev)
            throw (0, errors_1.NotFound)('Event not found');
        res.status(204).send();
    },
};
