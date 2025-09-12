import { Router } from 'express';
import userRoutes from '../modules/users/user.routes';
import eventRoutes from '../modules/events/event.routes';

const api = Router();

api.use('/users', userRoutes);
api.use('/events', eventRoutes);

export default api;