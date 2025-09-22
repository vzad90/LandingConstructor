import { Injectable } from '@nestjs/common';

@Injectable()
export class CloakingFilterService {
  public filterByOS(os: string, allowedOS: string[]): boolean {
    return allowedOS.includes(os);
  }

  public filterByBrowser(browser: string, allowedBrowsers: string[]): boolean {
    return allowedBrowsers.includes(browser);
  }

  public filterByDevice(device: string, allowedDevices: string[]): boolean {
    return allowedDevices.includes(device);
  }

  public filterByReferrer(
    referrer: string | undefined,
    blockedReferrers: string[],
  ): boolean {
    if (!referrer) return true;

    for (const blocked of blockedReferrers) {
      if (referrer.includes(blocked)) {
        return false;
      }
    }

    return true;
  }

  public filterByUserAgent(
    userAgent: string | undefined,
    blockedUserAgent: string[] | undefined,
  ): boolean {
    if (!userAgent || !blockedUserAgent) return false;

    const ua = userAgent.toLowerCase();

    for (const blocked of blockedUserAgent) {
      if (ua.includes(blocked.toLowerCase())) {
        return false;
      }
    }

    return true;
  }

  public getFailureReason(filterResults: any): string {
    const failedFilters = Object.entries(filterResults)
      .filter(([, passed]) => !passed)
      .map(([filter]) => filter.replace('Passed', ''));

    return `Failed filters: ${failedFilters.join(', ')}`;
  }
}
