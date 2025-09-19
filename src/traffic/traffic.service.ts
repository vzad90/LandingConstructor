import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Traffic, TrafficDocument } from './schemas/traffic.schema';
import { UAParser } from 'ua-parser-js';
import { join } from 'path';
import { FilterOSResponseDto } from './dto/filter-os-response.dto';
import { CreateTrafficRecordDto } from './dto/create-traffic-record.dto';
import { TrafficStatsResponseDto } from './dto/traffic-stats-response.dto';

@Injectable()
export class TrafficService {
  constructor(
    @InjectModel(Traffic.name) private trafficModel: Model<TrafficDocument>,
  ) {}

  filterOS(userAgent: string | undefined): FilterOSResponseDto {
    const parser = new UAParser(userAgent);
    const os = parser.getOS().name || 'Unknown';
    const allowedOS = ['Windows', 'Android'];
    const result = allowedOS.includes(os) ? 'black' : 'white';
    const filePath = join(__dirname, '..', '..', 'public', result, 'main.html');
    console.log(`Detected OS: ${os}, serving ${result} page`);

    return { filePath, result, os };
  }

  async createTrafficRecord(
    createTrafficRecordDto: CreateTrafficRecordDto,
  ): Promise<Traffic> {
    try {
      const trafficRecord = new this.trafficModel({
        userAgent: createTrafficRecordDto.userAgent,
        os: createTrafficRecordDto.os,
        result: createTrafficRecordDto.result,
        timestamp: new Date(),
      });

      return await trafficRecord.save();
    } catch (error) {
      console.error('Error saving traffic record:', error);
      throw error;
    }
  }

  async getTrafficStats(): Promise<TrafficStatsResponseDto> {
    try {
      const totalVisits = await this.trafficModel.countDocuments();
      const whitePageVisits = await this.trafficModel.countDocuments({
        result: 'white',
      });
      const blackPageVisits = await this.trafficModel.countDocuments({
        result: 'black',
      });

      const osStats = await this.trafficModel.aggregate([
        { $group: { _id: '$os', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { os: '$_id', count: 1, _id: 0 } },
      ]);

      const recentVisits = await this.trafficModel
        .find()
        .sort({ timestamp: -1 })
        .limit(10)
        .exec();

      return {
        totalVisits,
        whitePageVisits,
        blackPageVisits,
        osStats,
        recentVisits,
      };
    } catch (error) {
      console.error('Error getting traffic stats:', error);
      throw error;
    }
  }
}
