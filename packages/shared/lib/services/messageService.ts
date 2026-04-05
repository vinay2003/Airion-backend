import { api } from '../apiClient';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string;
  unreadCount: number;
  updatedAt: string;
}

export const messageService = {
  getThreads: async () => {
    return api.get<ChatThread[]>('/chats');
  },
  
  getMessages: async (threadId: string) => {
    return api.get<Message[]>(`/chats/${threadId}/messages`);
  },
  
  sendMessage: async (threadId: string, content: string) => {
    return api.post<Message>(`/chats/${threadId}/messages`, { content });
  },
  
  markAsRead: async (threadId: string) => {
    return api.patch<void>(`/chats/${threadId}/read`);
  }
};
