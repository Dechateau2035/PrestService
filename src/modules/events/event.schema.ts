import { z } from 'zod';

const EventType = z.enum(['mariage', 'buffet', 'bapteme', 'anniversaire', 'corporate', 'autre']);
const EventStatus = z.enum(['draft', 'pending', 'confirmed', 'cancelled', 'done']);

const serverAssign = z.object({
    staffId: z.string().min(1),
    role: z.string().min(1).optional(),
    hours: z.number().min(0).optional(),
});

export const createEventSchema = z
    .object({
        title: z.string().min(2),
        description: z.string().optional(),
        type: EventType,
        status: EventStatus.optional(),
        startAt: z.coerce.date(),
        endAt: z.coerce.date().optional(),
        totalAmount: z.number().min(0).optional(),
        currency: z.string().min(3).max(3).optional(),
        servers: z.array(serverAssign).optional(),
        client: z
            .object({
                name: z.string().optional(),
                phone: z.string().optional(),
                email: z.string().email().optional(),
            })
            .optional(),
        venue: z
            .object({
                address: z.string().optional(),
                city: z.string().optional(),
                location: z
                    .object({
                        type: z.literal('Point').default('Point'),
                        coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
                    })
                    .optional(),
            })
            .optional(),
    })
    .refine((data) => !data.endAt || data.endAt >= data.startAt, {
        message: 'endAt doit être >= startAt',
        path: ['endAt'],
    });

export const updateEventSchema = createEventSchema.partial();


export const updateStatusSchema = z.object({ status: EventStatus });
export const assignServersSchema = z.object({ servers: z.array(serverAssign).min(1) });


// Query list/pagination/tri/filtre
export const listEventsQuerySchema = z.object({
    q: z.string().optional(),
    status: EventStatus.optional(),
    type: EventType.optional(),
    types: z.string().optional(), // CSV de types (mariage,buffet)
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    minAmount: z.coerce.number().optional(),
    maxAmount: z.coerce.number().optional(),
    city: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z
        .string()
        .default('-startAt') // ex: -startAt, startAt, -totalAmount
        .refine((s) => /^(?:[-+]?\w+)(?:,(?:[-+]?\w+))*$/.test(s), 'Tri invalide'),
});

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
export type UpdateStatusDto = z.infer<typeof updateStatusSchema>;
export type AssignServersDto = z.infer<typeof assignServersSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;


// Middlewares de validation (compatibles avec ceux du module users)
export function validateBody<T>(schema: z.ZodSchema<T>) {
    return (req: any, res: any, next: any) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: { message: 'Validation error', details: parsed.error.flatten() } });
        }
        req.validated = parsed.data;
        next();
    };
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
    return (req: any, res: any, next: any) => {
        const parsed = schema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: { message: 'Query validation error', details: parsed.error.flatten() } });
        }
        req.q = parsed.data;
        next();
    };
}