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

  await app.listen(getServerConfig().port!);
}
bootstrap();
