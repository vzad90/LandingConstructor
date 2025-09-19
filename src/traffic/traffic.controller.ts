import type { Request, Response } from 'express';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import * as fs from 'fs';
import { join } from 'path';

@Controller()
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get()
  async handleRequest(@Req() req: Request, @Res() res: Response) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const { filePath, result, os } = this.trafficService.filterOS(userAgent);

    // Записуємо дані про відвідувача в базу даних
    try {
      await this.trafficService.createTrafficRecord(
        userAgent,
        os,
        result as 'white' | 'black',
      );
      console.log(`Traffic record saved for ${result} page (OS: ${os})`);
    } catch (error) {
      console.error('Failed to save traffic record:', error);
      // Продовжуємо роботу навіть якщо запис в БД не вдався
    }

    res.sendFile(filePath);
  }

  @Get('manifest.json')
  getManifest(@Req() req: Request, @Res() res: Response) {
    const { result } = this.trafficService.filterOS(req.headers['user-agent']);

    // Return manifest only for black page
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
      res.status(404).json({ error: 'Manifest not available for this OS' });
    }
  }

  @Get('sw.js')
  getServiceWorker(@Req() req: Request, @Res() res: Response) {
    const { result } = this.trafficService.filterOS(req.headers['user-agent']);

    // Return sw.js only for black page
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
      res
        .status(404)
        .json({ error: 'Service Worker not available for this OS' });
    }
  }

  @Get('stats')
  async getStats(@Res() res: Response) {
    try {
      const stats = await this.trafficService.getTrafficStats();
      res.json(stats);
    } catch (error) {
      console.error('Failed to get traffic stats:', error);
      res.status(500).json({ error: 'Failed to get traffic statistics' });
    }
  }
}
