import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { EventsGateway } from './events/events.gateway';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        private readonly eventsGateway: EventsGateway,
    ) { }

    async create(createDto: { userId: string; type: string; title: string; message: string; data?: any }): Promise<Notification> {
        // 1. Save Notification in Database
        const notification = this.notificationRepository.create(createDto);
        const savedNotification = await this.notificationRepository.save(notification);

        // 2. Trigger Real-time WebSocket emit
        try {
            this.eventsGateway.sendNotificationToUser(
                createDto.userId,
                'notification_received',
                {
                    id: savedNotification.id,
                    type: savedNotification.type,
                    title: savedNotification.title,
                    message: savedNotification.message,
                }
            );
        } catch (error) {
             console.error('Failed to trigger websocket socket for user:', createDto.userId, error);
        }

        return savedNotification;
    }

    async findAllForUser(userId: string): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(id: string, userId: string): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({ where: { id, userId } });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        notification.isRead = true;
        return this.notificationRepository.save(notification);
    }

    async markAllAsRead(userId: string): Promise<void> {
        await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });
    }
}
