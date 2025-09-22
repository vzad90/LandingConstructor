import type { Request, Response } from 'express';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { join } from 'path';
import { CreateTrafficRecordDto } from './dto/create-traffic-record.dto';
import { ConfigService } from '@nestjs/config';

@Controller()
export class TrafficController {
  constructor(
    private readonly trafficService: TrafficService,
    private readonly configService: ConfigService,
  ) {}

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
        result,
      };
      await this.trafficService.createTrafficRecord(createTrafficRecordDto);
    } catch (error) {
      console.error('Failed to save traffic record:', error);
    }

    res.sendFile(filePath);
  }

  @Get('stats')
  async getStats() {
    try {
      const stats = await this.trafficService.getTrafficStats();
      return stats;
    } catch (error) {
      console.error('Failed to get traffic stats:', error);
      throw new HttpException(
        'Failed to get traffic statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
