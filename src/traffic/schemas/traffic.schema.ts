import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TrafficDocument = Traffic & Document;

@Schema()
export class Traffic {
  @Prop({ required: true })
  @ApiProperty({
    description: 'User agent',
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  })
  userAgent: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Operating system',
    example: 'Windows',
  })
  os: string;

  @Prop({ required: true, default: Date.now })
  @ApiProperty({
    description: 'Timestamp',
    example: '2021-01-01T00:00:00.000Z',
  })
  timestamp: Date;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Result',
    example: './public/white/main.html',
  })
  result: string;
}

export const TrafficSchema = SchemaFactory.createForClass(Traffic);
