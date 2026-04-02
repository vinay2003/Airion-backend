import { Controller, Get, Patch, Post, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    async findAll(@Request() req: any) {
        return this.notificationsService.findAllForUser(req.user.userId);
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string, @Request() req: any) {
        return this.notificationsService.markAsRead(id, req.user.userId);
    }

    @Post('read-all')
    @HttpCode(HttpStatus.OK)
    async markAllAsRead(@Request() req: any) {
        await this.notificationsService.markAllAsRead(req.user.userId);
        return { success: true, message: 'All notifications marked as read' };
    }
}
