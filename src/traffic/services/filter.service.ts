import { Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { join } from 'path';
import { AdvancedFilterResponseDto } from '../dto/advanced-filter-response.dto';
import { ConfigService } from '@nestjs/config';
import { CloakingFilterService } from 'src/cloaking-filter/cloaking-filter.service';

@Injectable()
export class FilterService {
  constructor(
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
        filters.blockedUserAgents,
      ),
    };

    const allFiltersPassed = Object.values(filterResults).every(
      (result) => result,
    );
    const result = allFiltersPassed ? pageUrls.black : pageUrls.white;
    const filePath = join(__dirname, '..', '..', '..', result);

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
}
