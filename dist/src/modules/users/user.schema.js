"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
exports.validate = validate;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(2),
    role: zod_1.z.enum(['user', 'admin']).optional()
});
exports.updateUserSchema = exports.createUserSchema.partial();
function validate(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: { message: 'Validation error', details: parsed.error.flatten() } });
        }
        req.validated = parsed.data;
        next();
    };
}
