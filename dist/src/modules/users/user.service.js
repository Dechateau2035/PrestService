"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("./user.model");
exports.UserService = {
    list: () => user_model_1.UserModel.find().lean(),
    get: (id) => user_model_1.UserModel.findById(id).lean(),
    create: (dto) => user_model_1.UserModel.create(dto),
    update: (id, dto) => user_model_1.UserModel.findByIdAndUpdate(id, dto, { new: true }).lean(),
    remove: (id) => user_model_1.UserModel.findByIdAndDelete(id).lean(),
};
