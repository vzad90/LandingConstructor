import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { Traffic, TrafficSchema } from './schemas/traffic.schema';
import { CloakingFilterService } from 'src/cloaking-filter/cloaking-filter.service';
import { FilterService } from './services/filter.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Traffic.name, schema: TrafficSchema }]),
  ],
  controllers: [TrafficController],
  providers: [TrafficService, CloakingFilterService, FilterService],
  exports: [TrafficService],
})
export class TrafficModule {}
