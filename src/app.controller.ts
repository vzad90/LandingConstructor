import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
