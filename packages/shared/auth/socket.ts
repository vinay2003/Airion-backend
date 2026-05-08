import { io, Socket } from 'socket.io-client';
import { tokenService } from './tokenService';

const getBaseUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    return url.replace('/api', '');
};

let socket: Socket | null = null;

export const initiateSocketConnection = (userId: string): Socket => {
    if (socket) return socket;

    const token = tokenService.getAccessToken();

    socket = io(`${getBaseUrl()}/chat`, {
        auth: { token },           // ✅ WsJwtGuard reads from handshake.auth.token
        query: { userId },
        transports: ['websocket'],
    });

    if (import.meta.env.DEV) {
        socket.on('connect', () => {
            console.log(`[WebSocket] Connected with ID: ${socket?.id} for user: ${userId}`);
        });

        socket.on('disconnect', () => {
            console.log(`[WebSocket] Disconnected`);
        });
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = (): Socket | null => {
    return socket;
};
