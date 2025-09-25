import { Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { AdvancedFilterResponseDto } from './dto/advanced-filter-response.dto';
import { CreateTrafficRecordDto } from './dto/create-traffic-record.dto';
import { TrafficStatsResponseDto } from './dto/traffic-stats-response.dto';
import { Traffic, TrafficDocument } from './schemas/traffic.schema';
import { FilterService } from './services/filter.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TrafficService {
  constructor(
    @InjectModel(Traffic.name) private trafficModel: Model<TrafficDocument>,
    private readonly configService: ConfigService,
    private readonly filterService: FilterService,
    private readonly cacheManager: Cache,
  ) {}

  filter(
    userAgent: string | undefined,
    referrer?: string,
  ): AdvancedFilterResponseDto {
    return this.filterService.filter(userAgent, referrer);
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

      const savedRecord = await trafficRecord.save();
      await this.clearTrafficStatsCache();

      return savedRecord;
    } catch (error) {
      console.error('Error saving traffic record:', error);
      throw error;
    }
  }

  async getTrafficStats(): Promise<TrafficStatsResponseDto> {
    try {
      const cacheKey = 'traffic-stats';
      const cachedStats =
        await this.cacheManager.get<TrafficStatsResponseDto>(cacheKey);

      if (cachedStats) return cachedStats;

      const visitStats = await this.trafficModel.aggregate([
        {
          $group: {
            _id: null,
            totalVisits: { $sum: 1 },
            whitePageVisits: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$result', this.configService.get('pageUrls').white],
                  },
                  1,
                  0,
                ],
              },
            },
            blackPageVisits: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$result', this.configService.get('pageUrls').black],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

      const { totalVisits, whitePageVisits, blackPageVisits } =
        visitStats[0] || {
          totalVisits: 0,
          whitePageVisits: 0,
          blackPageVisits: 0,
        };

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

      const stats: TrafficStatsResponseDto = {
        totalVisits,
        whitePageVisits,
        blackPageVisits,
        osStats,
        recentVisits,
      };
      await this.cacheManager.set(cacheKey, stats, 120000);

      return stats;
    } catch (error) {
      console.error('Error getting traffic stats:', error);
      throw error;
    }
  }

  private async clearTrafficStatsCache(): Promise<void> {
    try {
      await this.cacheManager.del('traffic-stats');
    } catch (error) {
      console.error('Error clearing traffic stats cache:', error);
    }
  }
}
