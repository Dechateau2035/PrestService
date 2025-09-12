"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("../modules/users/user.routes"));
const event_routes_1 = __importDefault(require("../modules/events/event.routes"));
const api = (0, express_1.Router)();
api.use('/users', user_routes_1.default);
api.use('/events', event_routes_1.default);
exports.default = api;
