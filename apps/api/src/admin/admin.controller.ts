import { Controller, Get, Post, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('admin/governance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('disputes')
    @Roles(UserRole.ADMIN)
    async getDisputes(@Query('status') status?: string) {
        return this.adminService.getDisputes(status);
    }

    @Post('disputes/:id/resolve')
    @Roles(UserRole.ADMIN)
    async resolve(
        @Param('id') id: string,
        @Body() body: { resolution: string; refundAmount?: number }
    ) {
        return this.adminService.resolveDispute(id, body.resolution, body.refundAmount);
    }

    @Post('disputes/raise')
    async raise(@Request() req: any, @Body() body: { bookingId: string; reason: string }) {
        return this.adminService.createDispute({
            bookingId: body.bookingId,
            raisedById: req.user.userId,
            reason: body.reason
        });
    }

    @Post('vendors/:id/verify')
    @Roles(UserRole.ADMIN)
    async verifyVendor(@Param('id') id: string, @Body() body: { status: 'approved' | 'rejected' }) {
        return this.adminService.updateVendorStatus(id, body.status);
    }

    @Post('vendors/:id/suspend')
    @Roles(UserRole.ADMIN)
    async suspendVendor(@Param('id') id: string) {
        return this.adminService.suspendVendor(id);
    }
}
