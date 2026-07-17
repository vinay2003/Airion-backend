import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('merchandise')
export class MerchandiseController {
    constructor(private readonly merchandiseService: MerchandiseService) {}

    @Get()
    findAll() {
        return this.merchandiseService.findAll();
    }

    @Get('orders')
    @UseGuards(JwtAuthGuard)
    getOrders(@Req() req: any) {
        return this.merchandiseService.getOrders(req.user.userId);
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

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    checkout(@Body() orderData: any, @Req() req: any) {
        return this.merchandiseService.checkout(req.user.userId, orderData);
    }
}
