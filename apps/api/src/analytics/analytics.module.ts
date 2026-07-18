import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Global() // Make it global so other modules can track events easily
@Module({
    imports: [TypeOrmModule.forFeature([AnalyticsEvent]), SubscriptionsModule],
    providers: [AnalyticsService],
    controllers: [AnalyticsController],
    exports: [AnalyticsService],
})
export class AnalyticsModule {}
