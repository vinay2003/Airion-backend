import { Controller, Post, Get, Put, Body, Param, UseGuards, Req, Query, ForbiddenException } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { RefundStatus } from './entities/refund-request.entity';

@Controller('refunds')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RefundsController {
    constructor(private readonly refundsService: RefundsService) {}

    @Post()
    @Roles(UserRole.USER)
    createRefundRequest(
        @Req() req: any,
        @Body() body: { bookingId: string; bookingAmount: number; reason?: string; bankName: string; accountNumber: string; ifscCode: string; }
    ) {
        return this.refundsService.createRefundRequest(req.user.userId, body);
    }

    @Get('me')
    @Roles(UserRole.USER)
    getUserRefunds(@Req() req: any) {
        return this.refundsService.getUserRefunds(req.user.userId);
    }

    @Get('admin/all')
    @Roles(UserRole.ADMIN)
    getAllRefunds(@Query('status') status?: RefundStatus) {
        return this.refundsService.getAllRefunds(status);
    }

    @Get(':id')
    getRefundById(@Param('id') id: string, @Req() req: any) {
        const isAdmin = req.user.role === UserRole.ADMIN;
        return this.refundsService.getRefundById(id, req.user.userId, isAdmin);
    }

    @Put(':id/approve')
    @Roles(UserRole.ADMIN)
    approveRefund(@Param('id') id: string, @Body('adminNote') adminNote?: string) {
        return this.refundsService.approveRefund(id, adminNote);
    }

    @Put(':id/reject')
    @Roles(UserRole.ADMIN)
    rejectRefund(@Param('id') id: string, @Body('adminNote') adminNote: string) {
        return this.refundsService.rejectRefund(id, adminNote);
    }

    @Put(':id/processed')
    @Roles(UserRole.ADMIN)
    markProcessed(@Param('id') id: string) {
        return this.refundsService.markProcessed(id);
    }
}
