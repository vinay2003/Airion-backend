import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { AdsModule } from '../ads/ads.module';
import { RefundsModule } from '../refunds/refunds.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [AdsModule, RefundsModule, AnalyticsModule],
  providers: [CronService],
})
export class CronModule {}
