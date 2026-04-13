import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserDashboardService } from './user-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('user-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserDashboardController {
    constructor(private readonly dashboardService: UserDashboardService) {}

    @Get('overview')
    @Roles(UserRole.USER)
    async getOverview(@Request() req: any) {
        return this.dashboardService.getOverview(req.user.userId);
    }
}
