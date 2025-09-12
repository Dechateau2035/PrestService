"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEventsQuerySchema = exports.assignServersSchema = exports.updateStatusSchema = exports.updateEventSchema = exports.createEventSchema = void 0;
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
const zod_1 = require("zod");
const EventType = zod_1.z.enum(['mariage', 'buffet', 'bapteme', 'anniversaire', 'corporate', 'autre']);
const EventStatus = zod_1.z.enum(['draft', 'pending', 'confirmed', 'cancelled', 'done']);
const serverAssign = zod_1.z.object({
    staffId: zod_1.z.string().min(1),
    role: zod_1.z.string().min(1).optional(),
    hours: zod_1.z.number().min(0).optional(),
});
exports.createEventSchema = zod_1.z
    .object({
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    type: EventType,
    status: EventStatus.optional(),
    startAt: zod_1.z.coerce.date(),
    endAt: zod_1.z.coerce.date().optional(),
    totalAmount: zod_1.z.number().min(0).optional(),
    currency: zod_1.z.string().min(3).max(3).optional(),
    servers: zod_1.z.array(serverAssign).optional(),
    client: zod_1.z
        .object({
        name: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
    })
        .optional(),
    venue: zod_1.z
        .object({
        address: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        location: zod_1.z
            .object({
            type: zod_1.z.literal('Point').default('Point'),
            coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]), // [lng, lat]
        })
            .optional(),
    })
        .optional(),
})
    .refine((data) => !data.endAt || data.endAt >= data.startAt, {
    message: 'endAt doit être >= startAt',
    path: ['endAt'],
});
exports.updateEventSchema = exports.createEventSchema.partial();
exports.updateStatusSchema = zod_1.z.object({ status: EventStatus });
exports.assignServersSchema = zod_1.z.object({ servers: zod_1.z.array(serverAssign).min(1) });
// Query list/pagination/tri/filtre
exports.listEventsQuerySchema = zod_1.z.object({
    q: zod_1.z.string().optional(),
    status: EventStatus.optional(),
    type: EventType.optional(),
    types: zod_1.z.string().optional(), // CSV de types (mariage,buffet)
    from: zod_1.z.coerce.date().optional(),
    to: zod_1.z.coerce.date().optional(),
    minAmount: zod_1.z.coerce.number().optional(),
    maxAmount: zod_1.z.coerce.number().optional(),
    city: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    sort: zod_1.z
        .string()
        .default('-startAt') // ex: -startAt, startAt, -totalAmount
        .refine((s) => /^(?:[-+]?\w+)(?:,(?:[-+]?\w+))*$/.test(s), 'Tri invalide'),
});
// Middlewares de validation (compatibles avec ceux du module users)
function validateBody(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: { message: 'Validation error', details: parsed.error.flatten() } });
        }
        req.validated = parsed.data;
        next();
    };
}
function validateQuery(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: { message: 'Query validation error', details: parsed.error.flatten() } });
        }
        req.q = parsed.data;
        next();
    };
}
