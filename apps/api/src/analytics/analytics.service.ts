import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(AnalyticsEvent)
        private readonly eventRepository: Repository<AnalyticsEvent>,
    ) {}

    async trackEvent(type: any, targetId: string, userId?: string, metadata?: any) {
        const event = this.eventRepository.create({
            type,
            targetId,
            userId,
            metadata,
        });
        return this.eventRepository.save(event);
    }

    async getVendorPerformance(vendorId: string, days: number = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch views grouped by day
        const views = await this.eventRepository
            .createQueryBuilder('event')
            .select([
                "TO_CHAR(created_at, 'Mon DD') as name",
                "COUNT(*) as views"
            ])
            .where('event.targetId = :vendorId', { vendorId })
            .andWhere('event.type = :type', { type: 'profile_view' })
            .andWhere('event.createdAt >= :startDate', { startDate })
            .groupBy("TO_CHAR(created_at, 'Mon DD'), DATE_TRUNC('day', created_at)")
            .orderBy("DATE_TRUNC('day', created_at)", "ASC")
            .getRawMany();

        return views.map(v => ({
            name: v.name,
            views: Number(v.views),
            inquiries: Math.floor(Number(v.views) * 0.1), // Simulated conversion for now
        }));
    }
}
