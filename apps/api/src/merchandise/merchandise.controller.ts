import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('merchandise')
export class MerchandiseController {
    constructor(private readonly merchandiseService: MerchandiseService) {}

    @Get()
    findAll(@Query('vendorId') vendorId?: string) {
        return this.merchandiseService.findAll({ vendorId });
    }

    @Get('admin/all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    findAllAdmin() {
        return this.merchandiseService.findAll({ adminMode: true });
    }

    @Get('orders')
    @UseGuards(JwtAuthGuard)
    getOrders(@Req() req: any) {
        return this.merchandiseService.getOrders(req.user.userId);
    }

    @Get('vendor/orders')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.VENDOR)
    getVendorOrders(@Req() req: any) {
        return this.merchandiseService.getVendorOrders(req.user.userId);
    }

    @Patch('vendor/orders/:orderItemId/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.VENDOR)
    updateVendorOrderStatus(
        @Param('orderItemId') orderItemId: string,
        @Body() payload: any,
        @Req() req: any
    ) {
        return this.merchandiseService.updateOrderItemStatus(orderItemId, req.user.userId, payload);
    }

    @Get('admin/orders')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    getAdminOrders() {
        return this.merchandiseService.getAdminOrders();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.merchandiseService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.VENDOR)
    create(@Body() productData: any, @Req() req: any) {
        return this.merchandiseService.create(productData, req.user.userId, req.user.role);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.VENDOR)
    update(@Param('id') id: string, @Body() productData: any, @Req() req: any) {
        return this.merchandiseService.update(id, productData, req.user.userId, req.user.role);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.VENDOR)
    delete(@Param('id') id: string, @Req() req: any) {
        return this.merchandiseService.delete(id, req.user.userId, req.user.role);
    }

    @Put(':id/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    approve(@Param('id') id: string, @Body('status') status: 'approved' | 'rejected') {
        return this.merchandiseService.updateApprovalStatus(id, status);
    }

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    checkout(@Body() orderData: any, @Req() req: any) {
        return this.merchandiseService.checkout(req.user.userId, orderData);
    }
}
