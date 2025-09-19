import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('manifest.json')
  getManifest(@Res() res: Response) {
    const configPath = join(__dirname, '..', 'src/config/manifestConfig.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    res.json(config.manifest);
  }
}
