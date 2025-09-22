import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { getServerConfig } from './config/configuration';
import morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.static(join(__dirname, '..', 'public/black')));
  app.use(express.static(join(__dirname, '..', 'public/white')));

  app.use(morgan('dev'));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Landing Constructor API')
    .setDescription('API for cloaking and landing pages')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = getServerConfig().port;
  await app.listen(port, '0.0.0.0');

  console.log(`Server is running on:`);
  console.log(`Local:   http://localhost:${port}`);
  console.log(`API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
