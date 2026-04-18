import api from '../api';

export interface Message {
  id: string;
  senderId: string;
  conversationId: string;
  body: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
  };
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const messageService = {
  getConversations: async () => {
    return api.get<Conversation[]>('/chat/conversations');
  },
  
  getMessages: async (conversationId: string) => {
    return api.get<Message[]>(`/chat/messages/${conversationId}`);
  },
  
  startConversation: async (participantId: string) => {
    return api.post<Conversation>('/chat/start', { participantId });
  }
};
