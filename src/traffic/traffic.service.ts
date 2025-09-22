import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Traffic, TrafficDocument } from './schemas/traffic.schema';
import { UAParser } from 'ua-parser-js';
import { join } from 'path';
import { FilterOSResponseDto } from './dto/filter-os-response.dto';
import { AdvancedFilterResponseDto } from './dto/advanced-filter-response.dto';
import { CreateTrafficRecordDto } from './dto/create-traffic-record.dto';
import { TrafficStatsResponseDto } from './dto/traffic-stats-response.dto';
import { ConfigService } from '@nestjs/config';
import { CloakingFilterService } from 'src/cloaking-filter/cloaking-filter.service';

@Injectable()
export class TrafficService {
  constructor(
    @InjectModel(Traffic.name) private trafficModel: Model<TrafficDocument>,
    private readonly configService: ConfigService,
    private readonly cloakingFilterService: CloakingFilterService,
  ) {}

  filter(
    userAgent: string | undefined,
    referrer?: string,
  ): AdvancedFilterResponseDto {
    const parser = new UAParser(userAgent);
    const os = parser.getOS().name || 'Unknown';
    const browser = parser.getBrowser().name || 'Unknown';
    const device = parser.getDevice().type || 'desktop';
    const timestamp = new Date();

    const filters = this.configService.get('filters');
    const pageUrls = this.configService.get('pageUrls');

    const filterResults = {
      osPassed: this.cloakingFilterService.filterByOS(os, filters.os),
      browserPassed: this.cloakingFilterService.filterByBrowser(
        browser,
        filters.browsers,
      ),
      devicePassed: this.cloakingFilterService.filterByDevice(
        device,
        filters.devices,
      ),
      referrerPassed: this.cloakingFilterService.filterByReferrer(
        referrer,
        filters.blockedReferrers,
      ),
      userAgentPassed: this.cloakingFilterService.filterByUserAgent(
        userAgent,
        filters.userAgents,
      ),
    };

    const allFiltersPassed = Object.values(filterResults).every(
      (result) => result,
    );
    const result = allFiltersPassed ? pageUrls.black : pageUrls.white;
    const filePath = join(__dirname, '..', '..', result);

    console.log('Filter Results:', result);
    return {
      filePath,
      result,
      os,
      browser,
      device,
      userAgent: userAgent || 'Unknown',
      timestamp,
      filters: filterResults,
      reason: allFiltersPassed
        ? 'All filters passed'
        : this.cloakingFilterService.getFailureReason(filterResults),
    };
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
        result: this.configService.get('pageUrls').white,
      });
      const blackPageVisits = await this.trafficModel.countDocuments({
        result: this.configService.get('pageUrls').black,
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
