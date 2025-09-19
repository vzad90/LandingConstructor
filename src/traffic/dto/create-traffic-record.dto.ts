export class CreateTrafficRecordDto {
  userAgent: string;
  os: string;
  result: 'white' | 'black';
}
