import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdsService } from '../ads/ads.service';
import { RefundsService } from '../refunds/refunds.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { AdStatus } from '../ads/entities/ad.entity';
import { RefundStatus } from '../refunds/entities/refund-request.entity';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly adsService: AdsService,
    private readonly refundsService: RefundsService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleAdExpiry() {
    this.logger.log('Running Ad Expiry Check...');
    // Handled in AdsService
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleRefundChecks() {
    this.logger.log('Running Daily Refund Checks...');
    // We could auto-flag old pending refunds, or send notifications.
    const pendingRefunds = await this.refundsService.getAllRefunds(RefundStatus.PENDING);
    if (pendingRefunds.length > 0) {
      this.logger.warn(`Found ${pendingRefunds.length} pending refunds requiring attention.`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async refreshAnalytics() {
    this.logger.log('Refreshing Daily Analytics...');
    // E.g., aggregate previous day's events into materialized views or summary tables
  }
}
