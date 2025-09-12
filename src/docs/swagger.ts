import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.0.3',
        info: { title: 'PrestService API', version: '1.0.0' },
        tags: [{ name: 'Events', description: 'Gestion des événements' }],
        components: {
            schemas: {
                // ==== Users ====
                CreateUser: {
                    type: 'object',
                    required: ['email', 'name'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        name: { type: 'string', minLength: 2 },
                        role: { type: 'string', enum: ['user', 'admin'] }
                    }
                },
                UpdateUser: { $ref: '#/components/schemas/CreateUser' },

                // ==== Events ====
                EventType: { type: 'string', enum: ['mariage', 'buffet', 'bapteme', 'anniversaire', 'corporate', 'autre'] },
                EventStatus: { type: 'string', enum: ['draft', 'pending', 'confirmed', 'cancelled', 'done'] },
                ServerAssign: {
                    type: 'object',
                    properties: {
                        staffId: { type: 'string' },
                        role: { type: 'string' },
                        hours: { type: 'number', minimum: 0 },
                    },
                    required: ['staffId'],
                },
                CreateEvent: {
                    type: 'object',
                    required: ['title', 'type', 'startAt'],
                    properties: {
                        title: { type: 'string', minLength: 2 },
                        description: { type: 'string' },
                        type: { $ref: '#/components/schemas/EventType' },
                        status: { $ref: '#/components/schemas/EventStatus' },
                        startAt: { type: 'string', format: 'date-time' },
                        endAt: { type: 'string', format: 'date-time' },
                        totalAmount: { type: 'number', minimum: 0 },
                        currency: { type: 'string', minLength: 3, maxLength: 3, example: 'TND' },
                        servers: { type: 'array', items: { $ref: '#/components/schemas/ServerAssign' } },
                        client: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                phone: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                            },
                        },
                        venue: {
                            type: 'object',
                            properties: {
                                address: { type: 'string' },
                                city: { type: 'string' },
                                location: {
                                    type: 'object',
                                    properties: {
                                        type: { type: 'string', enum: ['Point'], default: 'Point' },
                                        coordinates: {
                                            type: 'array',
                                            items: { type: 'number' },
                                            minItems: 2,
                                            maxItems: 2,
                                            description: '[lng, lat]'
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                UpdateEvent: { $ref: '#/components/schemas/CreateEvent' },
                UpdateStatus: {
                    type: 'object',
                    required: ['status'],
                    properties: { status: { $ref: '#/components/schemas/EventStatus' } },
                },
                AssignServers: {
                    type: 'object',
                    required: ['servers'],
                    properties: { servers: { type: 'array', items: { $ref: '#/components/schemas/ServerAssign' } } },
                },
            }
        }
    },
    apis: [
        'src/**/*.routes.ts',
        'dist/**/*.routes.js'
    ] // <- lit les JSDoc @openapi
});