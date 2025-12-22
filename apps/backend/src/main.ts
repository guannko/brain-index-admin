import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:5173', // Admin panel dev
      'http://localhost:5174', // Client dashboard dev
      'https://admin.brain-index.com',
      'https://dashboard.brain-index.com',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Brain Index API running on http://localhost:${port}`);
  logger.log(`📚 API Prefix: /api/v1`);
}

bootstrap();
