import { Injectable } from '@nestjs/common';
// import { UAParser } from 'ua-parser-js';
import { join } from 'path';

@Injectable()
export class TrafficService {
  filterOS(userAgent: string | undefined): {
    filePath: string;
    result: string;
  } {
    // const parser = new UAParser(userAgent);
    // const os = parser.getOS().name || 'Unknown';
    const os = 'Windows';
    const allowedOS = ['Windows', 'Android'];
    const result = allowedOS.includes(os) ? 'black' : 'white';
    const filePath = join(__dirname, '..', '..', 'public', result, 'main.html');
    console.log(filePath);

    return { filePath, result };
  }
}
