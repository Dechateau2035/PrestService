import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServeurDto } from './dto/create-serveur.dto';
import { UpdateServeurDto } from './dto/update-serveur.dto';
import { Serveur, ServeurDocument, ServeurStatus } from './entities/serveur.entity';

@Injectable()
export class ServeurService {
  constructor(@InjectModel(Serveur.name) private model: Model<ServeurDocument>) { }

  /** CRUD par défaut **/
  async create(dto: CreateServeurDto) {
    const created = await this.model.create(dto);
    return created.toJSON();
  }

  findAll() {
    return this.model.find().sort({ nom: 1, prenom: 1 }).lean();;
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException('Serveur not found');
    return doc;
  }

  async update(id: string, dto: UpdateServeurDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!updated) throw new NotFoundException('Serveur not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).lean();
    if (!deleted) throw new NotFoundException('Serveur not found');
    return { success: true };
  }

  /** Statuts de serveur (key/value) **/
  serveurStatusesKV() {
    return Object.entries(ServeurStatus).map(([key, value]) => ({ key, value }));
  }
}
