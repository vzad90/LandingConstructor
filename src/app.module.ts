import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrafficModule } from './traffic/traffic.module';
import { MongooseModule } from '@nestjs/mongoose';
import { configuration, getDatabaseConfig } from './config/configuration';
import { CloakingFilterService } from './cloaking-filter/cloaking-filter.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300,
      max: 100,
    }),
    MongooseModule.forRoot(getDatabaseConfig().url),
    TrafficModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloakingFilterService],
})
export class AppModule {}
