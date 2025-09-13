import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/all-exceptions.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(['error', 'warn', 'log', 'debug']);   // logs plus bavards

  app.setGlobalPrefix('api')

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: true,
    credentials: false
  })

  const config = new DocumentBuilder()
    .setTitle('PrestService API')
    .setVersion('1.0.0')
    .addTag('Events')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);

  console.log(`🚀 http://51.77.200.96:${process.env.PORT || 3000} | Swagger /docs`);
}
bootstrap();
