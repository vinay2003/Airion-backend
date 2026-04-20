import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AIController {
    constructor(private readonly aiService: AIService) {}

    @Post('easy-reply')
    @Roles(UserRole.VENDOR)
    async generateReply(@Body() body: { inquiry: string; voice?: string }) {
        return this.aiService.generateEasyReply(body.inquiry, body.voice);
    }
}
