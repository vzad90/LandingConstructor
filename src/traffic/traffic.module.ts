import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { Traffic, TrafficSchema } from './schemas/traffic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Traffic.name, schema: TrafficSchema }]),
  ],
  controllers: [TrafficController],
  providers: [TrafficService],
  exports: [TrafficService],
})
export class TrafficModule {}
