"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const event_model_1 = require("./event.model");
exports.EventService = {
    async list(q) {
        const { q: text, status, type, types, from, to, minAmount, maxAmount, city, page = 1, limit = 10, sort = '-startAt', } = q;
        const cond = {};
        if (text)
            cond.$text = { $search: text };
        if (status)
            cond.status = status;
        const typeList = types ? types.split(',').map((t) => t.trim()).filter(Boolean) : undefined;
        if (type)
            cond.type = type;
        if (typeList && typeList.length)
            cond.type = { $in: typeList };
        if (from || to) {
            cond.startAt = {};
            if (from)
                cond.startAt.$gte = from;
            if (to)
                cond.startAt.$lte = to;
        }
        if (minAmount || maxAmount) {
            cond.totalAmount = {};
            if (minAmount != null)
                cond.totalAmount.$gte = minAmount;
            if (maxAmount != null)
                cond.totalAmount.$lte = maxAmount;
        }
        if (city)
            cond['venue.city'] = new RegExp(`^${city}$`, 'i');
        const projection = {};
        const sortBy = {};
        // tri multi-colonnes ex: "-startAt,totalAmount"
        for (const part of sort.split(',')) {
            const key = part.trim();
            if (!key)
                continue;
            const dir = key.startsWith('-') ? -1 : 1;
            const field = key.replace(/^[-+]/, '');
            sortBy[field] = dir;
        }
        if (text) {
            // Boost du score texte si recherche plein-texte
            projection.score = { $meta: 'textScore' };
            sortBy.score = { $meta: 'textScore' };
        }
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            event_model_1.EventModel.find(cond, projection).sort(sortBy).skip(skip).limit(limit).lean(),
            event_model_1.EventModel.countDocuments(cond),
        ]);
        const pages = Math.ceil(total / limit) || 1;
        return { items, total, page, limit, pages };
    },
    get(id) {
        return event_model_1.EventModel.findById(id).lean();
    },
    create(dto) {
        return event_model_1.EventModel.create(dto);
    },
    update(id, dto) {
        return event_model_1.EventModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    },
    updateStatus(id, dto) {
        return event_model_1.EventModel.findByIdAndUpdate(id, { status: dto.status }, { new: true }).lean();
    },
    assignServers(id, dto) {
        return event_model_1.EventModel.findByIdAndUpdate(id, { servers: dto.servers }, { new: true }).lean();
    },
    remove(id) {
        return event_model_1.EventModel.findByIdAndDelete(id).lean();
    },
};
