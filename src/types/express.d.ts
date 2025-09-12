import 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Request {
        /** Corps validé (Zod) */
        validated?: any;
        /** Query validée (Zod) */
        q?: any;
    }
}