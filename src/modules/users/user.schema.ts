import { z } from 'zod';

export const createUserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    role: z.enum(['user', 'admin']).optional()
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export function validate<T>(schema: z.ZodSchema<T>) {
    return (req: any, res: any, next: any) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: { message: 'Validation error', details: parsed.error.flatten() } });
        }
        req.validated = parsed.data;
        next();
    };
}
