import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import type { Request, Response } from 'express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { TrafficService } from './traffic/traffic.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly trafficService: TrafficService,
    private readonly configService: ConfigService,
  ) {}

  @Get('manifest.json')
  @ApiOperation({
    summary: 'Get PWA manifest',
    description:
      'Return the manifest for Progressive Web App only for the black page',
  })
  @ApiResponse({
    status: 200,
    description: 'PWA manifest successfully obtained',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Landing Constructor' },
            short_name: { type: 'string', example: 'LC' },
            icons: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Manifest not available for this OS',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Manifest not available' },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Get Service Worker',
    description: 'Return the Service Worker file only for the black page',
  })
  @ApiResponse({
    status: 200,
    description: 'Service Worker file successfully obtained',
    content: {
      'application/javascript': {
        schema: {
          type: 'string',
          example: '// Service Worker code',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service Worker not available for this OS',
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Service Worker not available for this OS',
        },
      },
    },
  })
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
