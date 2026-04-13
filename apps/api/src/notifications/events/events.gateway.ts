import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../auth/guards/ws-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with actual frontend domains
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map user/vendor ID to their socket IDs
  private connectedClients = new Map<string, string>();

  @UseGuards(WsJwtGuard)
  handleConnection(client: Socket) {
    const user = client.data.user;
    if (!user) {
        client.disconnect();
        return;
    }
    
    const userId = user.userId || user.sub;
    console.log(`Node synchronized: ${userId} (${client.id})`);
    
    this.connectedClients.set(userId, client.id);
    client.join(userId); 
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedClients.delete(userId);
    }
  }

  // Utility to send notification to a specific user (vendor, admin, or customer)
  sendNotificationToUser(userId: string, event: string, payload: any) {
    this.server.to(userId).emit(event, payload);
  }

  // Utility to broadcast to admins
  broadcastToAdmins(event: string, payload: any) {
    this.server.emit(`admin_${event}`, payload);
  }

  // Client to Server example subscription
  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket): string {
    return 'pong';
  }
}
