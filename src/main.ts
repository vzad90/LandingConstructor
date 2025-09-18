import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/white', express.static(join(__dirname, '..', 'public/white')));
  app.use('/black', express.static(join(__dirname, '..', 'public/black')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
