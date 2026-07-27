import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, Query, NotFoundException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { VendorsService } from '../vendors/vendors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('availability')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvailabilityController {
    constructor(
        private readonly availabilityService: AvailabilityService,
        private readonly vendorsService: VendorsService,
    ) {}

    @Get('vendor/:id')
    async getSchedule(@Param('id') id: string) {
        return this.availabilityService.getVendorSchedule(id, '');
    }

    @Post('test-block')
    async testBlock(@Body() body: { vendorId: string; date: string; reason?: string }) {
        return this.availabilityService.blockDate(body.vendorId, body.date, body.reason);
    }

    @Post('block')
    @Roles(UserRole.VENDOR)
    async blockDate(@Req() req: any, @Body() body: { date: string; reason?: string }) {
        const userId = req.user.userId || req.user.sub;
        const vendor = await this.vendorsService.findByUserId(userId);
        if (!vendor) throw new NotFoundException('Vendor profile not found');
        return this.availabilityService.blockDate(vendor.id, body.date, body.reason);
    }

    @Delete('block/:id')
    @Roles(UserRole.VENDOR)
    async unblockDate(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.userId || req.user.sub;
        const vendor = await this.vendorsService.findByUserId(userId);
        if (!vendor) throw new NotFoundException('Vendor profile not found');
        return this.availabilityService.unblockDate(vendor.id, id);
    }

    @Get('check')
    async check(@Query('vendorId') vendorId: string, @Query('date') date: string) {
        const available = await this.availabilityService.isAvailable(vendorId, date);
        return { available };
    }
}
