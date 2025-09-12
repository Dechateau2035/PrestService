"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
exports.env = {
    NODE_ENV: process.env.NODE_ENV ?? 'production',
    PORT: Number(process.env.PORT ?? 4000),
    MONGO_URI: process.env.MONGO_URI ?? 'mongodb+srv://nelagency2025_db_user:TIRbjEVm4g8wFQwu@cluster0.qeamgwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
};
