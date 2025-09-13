import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { EventDocument } from './entities/event.entity';
import { ListEventsDto } from './dto/list-events.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private model: Model<EventDocument>) { }

  async list(q: ListEventsDto) {
    const page = Math.max(parseInt(q.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(q.limit || '10', 10), 1), 100);

    const cond: FilterQuery<EventDocument> = {};
    if (q.q) (cond as any).$text = { $search: q.q };
    if (q.status) cond.status = q.status;
    if (q.type) cond.type = q.type;

    const sortBy: Record<string, SortOrder> = {};
    (q.sort || '-startAt').split(',').forEach(p => {
      const key = p.trim(); if (!key) return;
      const dir = key.startsWith('-') ? -1 : 1;
      const field = key.replace(/^[-+]/, '');
      sortBy[field] = dir as SortOrder;
    });

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.model.find(cond).sort(sortBy).skip(skip).limit(limit).lean(),
      this.model.countDocuments(cond),
    ]);
    return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
  }

  create(createEventDto: CreateEventDto) {
    return this.model.create(createEventDto);
  }

  findAll() {
    return this.model.collection;
  }

  findOne(id: string) {
    return this.model.findById(id).lean();
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.model.findByIdAndUpdate(id, updateEventDto, { new: true }).lean();
  }

  remove(id: string) {
    return this.model.findByIdAndDelete(id).lean();
  }
}
