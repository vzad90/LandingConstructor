import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrafficDocument = Traffic & Document;

@Schema()
export class Traffic {
  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  os: string;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @Prop({ required: true })
  result: string;
}

export const TrafficSchema = SchemaFactory.createForClass(Traffic);
