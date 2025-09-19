import { Traffic } from '../schemas/traffic.schema';

export class OSStatsDto {
  os: string;
  count: number;
}

export class TrafficStatsResponseDto {
  totalVisits: number;
  whitePageVisits: number;
  blackPageVisits: number;
  osStats: OSStatsDto[];
  recentVisits: Traffic[];
}
