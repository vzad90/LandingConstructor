import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response } from 'express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { TrafficService } from './traffic/traffic.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly trafficService: TrafficService,
    private readonly configService: ConfigService,
  ) {}

  @Get('manifest.json')
  getManifest(@Req() req: Request, @Res() res: Response): void {
    const { result } = this.trafficService.filter(req.headers['user-agent']);

    console.log('Manifest Result:', result);

    if (result === this.configService.get('pageUrls').black) {
      const manifest = this.configService.get('pwa');
      res.json(manifest);
    } else {
      res.status(404).json({ error: 'Manifest not available' });
    }
  }

  @Get('sw.js')
  getServiceWorker(@Req() req: Request, @Res() res: Response): void {
    const { result } = this.trafficService.filter(req.headers['user-agent']);

    if (result === this.configService.get('pageUrls').black) {
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
}
