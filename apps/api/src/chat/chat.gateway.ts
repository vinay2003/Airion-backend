import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WsJwtGuard } from '../auth/guards/ws-auth.guard';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'chat',
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    constructor(private readonly chatService: ChatService) {}

    afterInit(server: Server) {
        this.logger.log('Chat Socket Initialized');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() conversationId: string, @ConnectedSocket() client: Socket) {
        client.join(conversationId);
        this.logger.log(`Client ${client.id} joined room ${conversationId}`);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() data: { conversationId: string; senderId: string; body: string },
        @ConnectedSocket() client: Socket,
    ) {
        const message = await this.chatService.saveMessage(data.conversationId, data.senderId, data.body);
        this.server.to(data.conversationId).emit('receiveMessage', message);
        return message;
    }
}
