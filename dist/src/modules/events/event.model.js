"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModel = void 0;
const mongoose_1 = require("mongoose");
const serverAssignSchema = new mongoose_1.Schema({
    staffId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, trim: true },
    hours: { type: Number, min: 0 },
}, { _id: false });
const eventSchema = new mongoose_1.Schema({
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
            coordinates: { type: [Number], validate: (v) => v.length === 2 },
        },
    },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
// Index texte pour recherche globale (titre, description, nom du client)
eventSchema.index({ title: 'text', description: 'text', 'client.name': 'text' });
// Index géospatial
eventSchema.index({ 'venue.location': '2dsphere' });
exports.EventModel = (0, mongoose_1.model)('Event', eventSchema);
