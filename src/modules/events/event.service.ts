import type { FilterQuery, ProjectionFields, SortOrder } from 'mongoose';
import { EventModel, type EventDoc } from './event.model';
import type { AssignServersDto, CreateEventDto, ListEventsQuery, UpdateEventDto, UpdateStatusDto } from './event.schema';

export const EventService = {
    async list(q: ListEventsQuery) {
        const {
            q: text,
            status,
            type,
            types,
            from,
            to,
            minAmount,
            maxAmount,
            city,
            page = 1,
            limit = 10,
            sort = '-startAt',
        } = q;

        const cond: FilterQuery<EventDoc> = {};
        if (text) cond.$text = { $search: text } as any;
        if (status) cond.status = status;
        const typeList = types ? types.split(',').map((t) => t.trim()).filter(Boolean) : undefined;
        if (type) cond.type = type;
        if (typeList && typeList.length) cond.type = { $in: typeList } as any;
        if (from || to) {
            cond.startAt = {} as any;
            if (from) (cond.startAt as any).$gte = from;
            if (to) (cond.startAt as any).$lte = to;
        }
        if (minAmount || maxAmount) {
            cond.totalAmount = {} as any;
            if (minAmount != null) (cond.totalAmount as any).$gte = minAmount;
            if (maxAmount != null) (cond.totalAmount as any).$lte = maxAmount;
        }
        if (city) cond['venue.city'] = new RegExp(`^${city}$`, 'i');

        const projection: ProjectionFields<EventDoc> = {};
        const sortBy: Record<string, SortOrder> = {};


        // tri multi-colonnes ex: "-startAt,totalAmount"
        for (const part of sort.split(',')) {
            const key = part.trim();
            if (!key) continue;
            const dir = key.startsWith('-') ? -1 : 1;
            const field = key.replace(/^[-+]/, '');
            sortBy[field] = dir as SortOrder;
        }


        if (text) {
            // Boost du score texte si recherche plein-texte
            (projection as any).score = { $meta: 'textScore' };
            (sortBy as any).score = { $meta: 'textScore' } as any;
        }

        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            EventModel.find(cond, projection).sort(sortBy).skip(skip).limit(limit).lean(),
            EventModel.countDocuments(cond),
        ]);


        const pages = Math.ceil(total / limit) || 1;
        return { items, total, page, limit, pages };
    },

    get(id: string) {
        return EventModel.findById(id).lean();
    },

    create(dto: CreateEventDto) {
        return EventModel.create(dto);
    },

    update(id: string, dto: UpdateEventDto) {
        return EventModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    },

    updateStatus(id: string, dto: UpdateStatusDto) {
        return EventModel.findByIdAndUpdate(id, { status: dto.status }, { new: true }).lean();
    },

    assignServers(id: string, dto: AssignServersDto) {
        return EventModel.findByIdAndUpdate(id, { servers: dto.servers }, { new: true }).lean();
    },

    remove(id: string) {
        return EventModel.findByIdAndDelete(id).lean();
    },
}