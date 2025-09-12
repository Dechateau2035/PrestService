import { app } from './app';
import { connectDB } from './config/db';
import { env } from './env';

async function bootstrap() {
  if (!env.MONGO_URI) {
    console.warn('⚠️  MONGO_URI manquant: définis-le dans .env (Atlas ou local). Je démarre quand même...');
  } else {
    await connectDB();
  }
  app.listen(env.PORT, () => console.log(`🚀 API on http://localhost:${env.PORT} | Swagger /docs`));
}

bootstrap();