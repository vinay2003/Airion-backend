import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    // Public/User endpoints
    @Get('plans')
    getPlans(@Query('type') type: 'user' | 'vendor') {
        return this.subscriptionsService.getActivePlans(type);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-plan')
    getMyPlan(@Req() req) {
        return this.subscriptionsService.getUserActiveSubscription(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    createCheckoutSession(@Req() req, @Body() body: { planId: string }) {
        return this.subscriptionsService.createCheckoutSession(req.user.id, body.planId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('cancel')
    cancelSubscription(@Req() req) {
        return this.subscriptionsService.cancelSubscription(req.user.id);
    }

    // Admin endpoints
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('admin/plans')
    getAllPlans() {
        return this.subscriptionsService.getAllPlans();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post('admin/plans')
    createPlan(@Body() planData: any) {
        return this.subscriptionsService.createPlan(planData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put('admin/plans/:id')
    updatePlan(@Param('id') id: string, @Body() planData: any) {
        return this.subscriptionsService.updatePlan(id, planData);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('admin/subscribers')
    getSubscribers() {
        return this.subscriptionsService.getAllSubscribers();
    }
}
