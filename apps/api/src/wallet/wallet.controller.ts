import { Controller, Get, Post, Body, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { VendorsService } from '../vendors/vendors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('wallet')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WalletController {
    constructor(
        private readonly walletService: WalletService,
        private readonly vendorsService: VendorsService,
    ) {}

    @Get('overview')
    @Roles(UserRole.VENDOR)
    async getOverview(@Req() req: any) {
        const userId = req.user.userId || req.user.sub;
        const vendor = await this.vendorsService.findByUserId(userId);
        if (!vendor) throw new NotFoundException('Vendor profile not found');
        
        const overview = await this.walletService.getWalletOverview(vendor.id);
        const payoutHistory = await this.walletService.getPayoutHistory(vendor.id);
        
        return { ...overview, payoutHistory };
    }

    @Post('withdraw')
    @Roles(UserRole.VENDOR)
    async withdraw(@Req() req: any, @Body() body: { amount: number, bankDetails?: any }) {
        const userId = req.user.userId || req.user.sub;
        const vendor = await this.vendorsService.findByUserId(userId);
        if (!vendor) throw new NotFoundException('Vendor profile not found');
        return this.walletService.requestWithdrawal(vendor.id, body.amount, body.bankDetails);
    }
}
