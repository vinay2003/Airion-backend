import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { PremiumGuard } from '../auth/guards/premium.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get('vendor/:id/performance')
    @UseGuards(PremiumGuard)
    @Roles(UserRole.VENDOR, UserRole.ADMIN)
    async getPerformance(
        @Param('id') id: string,
        @Query('days') days: number = 7
    ) {
        return this.analyticsService.getVendorPerformance(id, days);
    }

    @Get('admin/global-stats')
    @Roles(UserRole.ADMIN)
    async getGlobalStats() {
        return this.analyticsService.getAdminGlobalStats();
    }
}
