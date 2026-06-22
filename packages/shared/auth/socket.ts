import { io, Socket } from 'socket.io-client';
import { tokenService } from './tokenService';

const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        return envUrl.replace('/api', '');
    }
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return 'https://airion-backend-1.onrender.com';
        }
    }
    return 'http://localhost:3000';
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
