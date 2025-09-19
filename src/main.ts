import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { getServerConfig } from './config/configuration';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.static(join(__dirname, '..', 'public/black')));
  app.use(express.static(join(__dirname, '..', 'public/white')));

  app.use(morgan('dev'));

  // Дозволяємо CORS для доступу з інших пристроїв
  app.enableCors();

  const port = getServerConfig().port!;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server is running on:`);
  console.log(`   Local:   http://localhost:${port}`);
}
bootstrap();
