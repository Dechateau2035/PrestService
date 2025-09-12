import { Schema, model, Types } from 'mongoose';

export type EventType = 'mariage' | 'buffet' | 'bapteme' | 'anniversaire' | 'corporate' | 'autre';
export type EventStatus = 'draft' | 'pending' | 'confirmed' | 'cancelled' | 'done';

export interface EventServerAssignment {
    staffId: Types.ObjectId | string;
    role?: string;
    hours?: number; // heures prévues/consommées
}

export interface EventDoc {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    type: EventType;
    status: EventStatus;
    startAt: Date;
    endAt?: Date;
    totalAmount?: number; // Montant total
    currency?: string; // ex: TND, EUR
    servers?: EventServerAssignment[];
    client?: {
        name?: string;
        phone?: string;
        email?: string;
    };
    venue?: {
        address?: string;
        city?: string;
        location?: { type: 'Point'; coordinates: [number, number] }; // [lng, lat]
    };
    createdBy?: Types.ObjectId | string;
    updatedBy?: Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

const serverAssignSchema = new Schema<EventServerAssignment>(
    {
        staffId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, trim: true },
        hours: { type: Number, min: 0 },
    },
    { _id: false },
);

const eventSchema = new Schema<EventDoc>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        type: { type: String, enum: ['mariage', 'buffet', 'bapteme', 'anniversaire', 'corporate', 'autre'], required: true },
        status: { type: String, enum: ['draft', 'pending', 'confirmed', 'cancelled', 'done'], default: 'draft', index: true },
        startAt: { type: Date, required: true, index: true },
        endAt: { type: Date },
        totalAmount: { type: Number, min: 0, default: 0 },
        currency: { type: String, default: 'TND' },
        servers: { type: [serverAssignSchema], default: [] },
        client: {
            name: { type: String, trim: true },
            phone: { type: String, trim: true },
            email: { type: String, trim: true, lowercase: true },
        },
        venue: {
            address: { type: String, trim: true },
            city: { type: String, trim: true },
            location: {
                type: { type: String, enum: ['Point'] },
                coordinates: { type: [Number], validate: (v: number[]) => v.length === 2 },
            },
        },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
);

// Index texte pour recherche globale (titre, description, nom du client)
(eventSchema as any).index({ title: 'text', description: 'text', 'client.name': 'text' });
// Index géospatial
(eventSchema as any).index({ 'venue.location': '2dsphere' });


export const EventModel = model<EventDoc>('Event', eventSchema);