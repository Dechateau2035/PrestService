import express from 'express';
import { baseMiddlewares, notFoundHandler, errorHandler } from './common/middlewares';
import api from './routes';
import { swaggerSpec } from './docs/swagger';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';

export const app = express();

app.use(express.json());
baseMiddlewares.forEach(mw => app.use(mw));

app.use(helmet({
  crossOriginOpenerPolicy: false,  // évite le warning COOP en HTTP
  originAgentCluster: false        // évite le warning OAC incohérent
}));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', api);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // UI
app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));  // export JSON

app.use(notFoundHandler);
app.use(errorHandler); 