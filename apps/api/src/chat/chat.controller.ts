import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('conversations')
    async getConversations(@Req() req: any) {
        return this.chatService.getConversations(req.user.userId);
    }

    @Get('messages/:conversationId')
    async getMessages(@Param('conversationId') conversationId: string, @Req() req: any) {
        return this.chatService.getMessages(conversationId, req.user.userId);
    }

    @Post('start')
    async startConversation(@Req() req: any, @Body() data: { vendorId: string }) {
        // Start conversation between user and vendor
        return this.chatService.startConversation([req.user.userId, data.vendorId]);
    }
}
