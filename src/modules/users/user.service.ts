import { UserModel } from './user.model';
import type { CreateUserDto, UpdateUserDto } from './user.schema';

export const UserService = {
    list: () => UserModel.find().lean(),
    get: (id: string) => UserModel.findById(id).lean(),
    create: (dto: CreateUserDto) => UserModel.create(dto),
    update: (id: string, dto: UpdateUserDto) => UserModel.findByIdAndUpdate(id, dto, { new: true }).lean(),
    remove: (id: string) => UserModel.findByIdAndDelete(id).lean(),
};
