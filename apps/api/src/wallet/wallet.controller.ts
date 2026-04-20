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
        const vendor = await this.vendorsService.findByUserId(req.user.id);
        if (!vendor) throw new NotFoundException('Vendor profile not found');
        return this.walletService.getWalletOverview(vendor.id);
    }

    @Post('withdraw')
    @Roles(UserRole.VENDOR)
    async withdraw(@Req() req: any, @Body() body: { amount: number }) {
        const vendor = await this.vendorsService.findByUserId(req.user.id);
        if (!vendor) throw new NotFoundException('Vendor profile not found');
        return this.walletService.requestWithdrawal(vendor.id, body.amount);
    }
}
