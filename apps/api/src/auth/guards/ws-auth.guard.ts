import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
    private readonly logger = new Logger(WsJwtGuard.name);

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const client: Socket = context.switchToWs().getClient<Socket>();
            const token = this.extractTokenFromHandshake(client);

            if (!token) {
                this.logger.error('No token found in WS handshake');
                throw new WsException('Unauthorized: Missing token');
            }

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            // 🔐 Zero-Trust: Bind user node to socket session
            client.data.user = payload;
            
            return true;
        } catch (err: any) {
            this.logger.error(`WS Authorization failure: ${err?.message || 'Unknown error'}`);
            throw new WsException('Unauthorized: Identity Sync failed');
        }
    }

    private extractTokenFromHandshake(client: Socket): string | undefined {
        // Support token in query string or auth header
        const auth = client.handshake.auth?.token || client.handshake.headers?.authorization;
        if (auth && auth.startsWith('Bearer ')) {
            return auth.split(' ')[1];
        }
        return auth || (client.handshake.query?.token as string);
    }
}
