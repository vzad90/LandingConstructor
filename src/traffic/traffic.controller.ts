import type { Request, Response } from 'express';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { TrafficService } from './traffic.service';
import { CreateTrafficRecordDto } from './dto/create-traffic-record.dto';
import { TrafficStatsResponseDto } from './dto/traffic-stats-response.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('traffic')
@Controller()
export class TrafficController {
  constructor(
    private readonly trafficService: TrafficService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Handle request',
    description:
      'Filter traffic based on User-Agent and return the corresponding page (white or black)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the corresponding page (white or black)',
    content: {
      'text/html': {
        schema: {
          type: 'string',
          example: '<html>...</html>',
        },
      },
    },
  })
  async handleRequest(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referrer = req.headers.referer || req.headers.referrer;

    const filterResult = this.trafficService.filter(
      userAgent,
      referrer as string,
    );

    try {
      const createTrafficRecordDto: CreateTrafficRecordDto = {
        userAgent,
        os: filterResult.os,
        result: filterResult.result,
      };
      await this.trafficService.createTrafficRecord(createTrafficRecordDto);
    } catch (error) {
      console.error('Failed to save traffic record:', error);
    }

    res.sendFile(filterResult.filePath);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get traffic statistics',
    description:
      'Get detailed statistics on visits, including distribution by OS and recent visits',
  })
  @ApiResponse({
    status: 200,
    description: 'Traffic statistics successfully obtained',
    type: TrafficStatsResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Server error when getting statistics',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Failed to get traffic statistics',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
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
