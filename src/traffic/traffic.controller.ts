import type { Request, Response } from 'express';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { TrafficService } from './traffic.service';

@Controller()
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get()
  handleRequest(@Req() req: Request, @Res() res: Response) {
    const {filePath, result} = this.trafficService.filterOS(req.headers['user-agent']);
    res.sendFile(filePath);
  }
}
