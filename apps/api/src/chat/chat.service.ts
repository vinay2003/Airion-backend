import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, Message } from './entities/chat.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        private readonly notificationsService: NotificationsService,
    ) {}

    async getConversations(userId: string): Promise<Conversation[]> {
        return this.conversationRepository
            .createQueryBuilder('conversation')
            .where(':userId = ANY(conversation.participantIds)', { userId })
            .orderBy('conversation.lastMessageAt', 'DESC')
            .getMany();
    }

    async getMessages(conversationId: string, userId: string): Promise<Message[]> {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
        });

        if (!conversation || !conversation.participantIds.includes(userId)) {
            throw new NotFoundException('Conversation not found');
        }

        return this.messageRepository.find({
            where: { conversationId },
            order: { createdAt: 'ASC' },
            relations: ['sender'],
        });
    }

    async saveMessage(conversationId: string, senderId: string, body: string): Promise<Message> {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
        });

        if (!conversation) throw new NotFoundException('Conversation not found');

        const message = this.messageRepository.create({
            conversationId,
            senderId,
            body,
        });

        const savedMessage = await this.messageRepository.save(message);

        // Update conversation last message node
        conversation.lastMessage = body;
        conversation.lastMessageAt = new Date();
        await this.conversationRepository.save(conversation);

        // Notify other participants
        try {
            const others = conversation.participantIds.filter(id => id !== senderId);
            for (const otherId of others) {
                await this.notificationsService.create({
                    userId: otherId,
                    type: 'message_received',
                    title: 'New Message',
                    message: body.length > 50 ? `${body.substring(0, 50)}...` : body,
                    data: { conversationId, messageId: savedMessage.id }
                });
            }
        } catch (err) {
            console.error('Failed to send chat notification:', err);
        }

        return savedMessage;
    }

    async startConversation(participantIds: string[]): Promise<Conversation> {
        // Check if conversation already exists between these precise participants
        const existing = await this.conversationRepository
            .createQueryBuilder('conversation')
            .where('conversation.participantIds @> :ids', { ids: participantIds })
            .andWhere('array_length(conversation.participantIds, 1) = :len', { len: participantIds.length })
            .getOne();

        if (existing) return existing;

        const conversation = this.conversationRepository.create({
            participantIds,
        });
        return this.conversationRepository.save(conversation);
    }

    async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
        await this.messageRepository
            .createQueryBuilder()
            .update(Message)
            .set({ isRead: true, readAt: new Date() })
            .where('conversation_id = :conversationId', { conversationId })
            .andWhere('sender_id != :userId', { userId })
            .andWhere('is_read = false')
            .execute();
    }
}
