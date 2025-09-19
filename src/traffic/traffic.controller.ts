import type { Request, Response } from 'express';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import * as fs from 'fs';
import { join } from 'path';
import { CreateTrafficRecordDto } from './dto/create-traffic-record.dto';

@Controller()
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get()
  async handleRequest(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const { filePath, result, os } = this.trafficService.filterOS(userAgent);

    try {
      const createTrafficRecordDto: CreateTrafficRecordDto = {
        userAgent,
        os,
        result: result as 'white' | 'black',
      };
      await this.trafficService.createTrafficRecord(createTrafficRecordDto);
      console.log(`Traffic record saved for ${result} page (OS: ${os})`);
    } catch (error) {
      console.error('Failed to save traffic record:', error);
    }

    res.sendFile(filePath);
  }

  @Get('manifest.json')
  getManifest(@Req() req: Request, @Res() res: Response): void {
    const { result } = this.trafficService.filterOS(req.headers['user-agent']);

    if (result === 'black') {
      const configPath = join(
        __dirname,
        '../..',
        'src/config',
        'manifestConfig.json',
      );
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const manifest = config.manifest;
      res.json(manifest);
    } else {
      res.status(404).json({ error: 'Manifest not available for this OS' });
    }
  }

  @Get('sw.js')
  getServiceWorker(@Req() req: Request, @Res() res: Response): void {
    const { result } = this.trafficService.filterOS(req.headers['user-agent']);

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
  async getStats(@Res() res: Response): Promise<void> {
    try {
      const stats = await this.trafficService.getTrafficStats();
      res.json(stats);
    } catch (error) {
      console.error('Failed to get traffic stats:', error);
      res.status(500).json({ error: 'Failed to get traffic statistics' });
    }
  }
}
