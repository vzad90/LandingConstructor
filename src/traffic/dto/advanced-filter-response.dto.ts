export class AdvancedFilterResponseDto {
  filePath: string;
  result: string;
  os: string;
  browser: string;
  device: string;
  userAgent: string;
  timestamp: Date;
  filters: {
    osPassed: boolean;
    browserPassed: boolean;
    devicePassed: boolean;
    referrerPassed: boolean;
    userAgentPassed: boolean;
  };
  reason?: string;
}
