import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards, Query, Req, Headers } from '@nestjs/common';
import { Request } from 'express';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
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
    getMyPlan(@Req() req: Request & { user: any }) {
        return this.subscriptionsService.getUserActiveSubscription(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    createCheckoutSession(@Req() req: Request & { user: any }, @Body() body: { planId: string }) {
        return this.subscriptionsService.createCheckoutSession(req.user.id, body.planId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('cancel')
    cancelSubscription(@Req() req: Request & { user: any }) {
        return this.subscriptionsService.cancelSubscription(req.user.id);
    }

    // Webhook endpoint (unprotected, relies on signature verification)
    @Post('webhook/payment')
    handlePaymentWebhook(@Body() payload: any, @Headers('stripe-signature') signature: string) {
        return this.subscriptionsService.handlePaymentWebhook(payload, signature);
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
    @Patch('admin/plans/:id/toggle')
    togglePlanStatus(@Param('id') id: string) {
        return this.subscriptionsService.togglePlanStatus(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete('admin/plans/:id')
    deletePlan(@Param('id') id: string) {
        return this.subscriptionsService.deletePlan(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('admin/subscribers')
    getSubscribers() {
        return this.subscriptionsService.getAllSubscribers();
    }
}
