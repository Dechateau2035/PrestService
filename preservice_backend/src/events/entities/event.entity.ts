import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;
export type EventType = 'mariage' | 'buffet' | 'bapteme' | 'anniversaire' | 'corporate' | 'autre';
export type EventStatus = 'draft' | 'pending' | 'confirmed' | 'cancelled' | 'done';

@Schema({ timestamps: true })
export class Event {
    @Prop({ required: true, trim: true })
    title: string;
    @Prop({ trim: true })
    description?: string;
    @Prop({ required: true, enum: ['mariage', 'buffet', 'bapteme', 'anniversaire', 'corporate', 'autre'] })
    type: EventType;
    @Prop({ enum: ['draft', 'pending', 'confirmed', 'cancelled', 'done'], default: 'draft', index: true })
    status: EventStatus;
    @Prop({ required: true, index: true })
    startAt: Date;
    @Prop()
    endAt?: Date;
    @Prop({ default: 0, min: 0 })
    totalAmount?: number;
    @Prop({ default: 'TND' })
    currency?: string;
    @Prop({ type: Object })
    client?: { name?: string; phone?: string; email?: string };
    @Prop({ type: Object })
    venue?: { address?: string; city?: string };
}

export const EventSchema = SchemaFactory.createForClass(Event);

(EventSchema as any).index({ title: 'text', description: 'text', 'client.name': 'text' });
