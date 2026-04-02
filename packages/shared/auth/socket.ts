import { io, Socket } from 'socket.io-client';

const getBaseUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    return url.replace('/api', '');
};

let socket: Socket | null = null;

export const initiateSocketConnection = (userId: string): Socket => {
    if (socket) return socket;

    socket = io(getBaseUrl(), {
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
