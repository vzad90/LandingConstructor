import { ApiProperty } from '@nestjs/swagger';
import { Traffic } from '../schemas/traffic.schema';

export class OSStatsDto {
  os: string;
  count: number;
}

export class TrafficStatsResponseDto {
  @ApiProperty({
    description: 'Total number of visits',
    example: 1000,
  })
  totalVisits: number;

  @ApiProperty({
    description: 'Count of visits from white page',
    example: 600,
  })
  whitePageVisits: number;

  @ApiProperty({
    description: 'Count of visits from black page',
    example: 400,
  })
  blackPageVisits: number;

  @ApiProperty({
    description: 'Statistics by operating systems',
    type: [OSStatsDto],
  })
  osStats: OSStatsDto[];

  @ApiProperty({
    description: 'Recent visits',
    type: [Traffic],
  })
  recentVisits: Traffic[];
}
