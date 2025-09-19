import type { Request, Response } from 'express';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import * as fs from 'fs';
import { join } from 'path';

@Controller()
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get()
  handleRequest(@Req() req: Request, @Res() res: Response) {
    const { filePath, result } = this.trafficService.filterOS(
      req.headers['user-agent'],
    );
    res.sendFile(filePath);
  }

  @Get('manifest.json')
  getManifest(@Req() req: Request, @Res() res: Response) {
    const { result } = this.trafficService.filterOS(req.headers['user-agent']);

    // Повертаємо маніфест тільки для black сторінки
    if (result === 'black') {
      const configPath = join(
        __dirname,
        '../..',
        'src/config',
        'manifestConfig.json',
      );
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      res.json(config.manifest);
    } else {
      // Для white сторінки повертаємо 404
      res.status(404).json({ error: 'Manifest not available for this OS' });
    }
  }

  @Get('sw.js')
  getServiceWorker(@Req() req: Request, @Res() res: Response) {
    const { result } = this.trafficService.filterOS(req.headers['user-agent']);

    // Повертаємо service worker тільки для black сторінки
    if (result === 'black') {
      const swPath = join(__dirname, '..', '..', 'public', 'black', 'sw.js');
      res.set({
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      });
      res.sendFile(swPath);
    } else {
      // Для white сторінки повертаємо 404
      res
        .status(404)
        .json({ error: 'Service Worker not available for this OS' });
    }
  }
}
