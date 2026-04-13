import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private notificationsService: NotificationsService,
    ) {}

    async create(bookingData: Partial<Booking>): Promise<Booking> {
        // Generate a simple booking code: B-timestamp
        const bookingCode = `B-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const booking = this.bookingsRepository.create({
            ...bookingData,
            bookingCode,
            status: 'pending',
            paymentStatus: 'pending',
        });
        const savedBooking = await this.bookingsRepository.save(booking);

        // Notify Vendor
        try {
            const fullBooking = await this.bookingsRepository.findOne({
                where: { id: savedBooking.id },
                relations: ['vendor', 'user', 'service'],
            });

            if (fullBooking?.vendor?.userId) {
                await this.notificationsService.create({
                    userId: fullBooking.vendor.userId,
                    type: 'booking_new',
                    title: 'New Booking Request',
                    message: `You have a new booking request for ${fullBooking.service?.title || 'a service'} from ${fullBooking.user?.name || 'a customer'}.`,
                    data: { bookingId: fullBooking.id }
                });
            }
        } catch (err) {
            console.error('Failed to send notification:', err);
        }

        return savedBooking;
    }

    async findOne(id: string, user?: { userId: string, role: string }): Promise<Booking> {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['user', 'vendor'], // Include relevant related data
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        
        // Data Isolation Validation
        if (user && user.role !== 'admin') {
            if (user.role === 'user' && booking.userId !== user.userId) {
                throw new ForbiddenException('You do not have permission to view this booking');
            }
            if (user.role === 'vendor' && booking.vendor?.userId !== user.userId) {
                throw new ForbiddenException('You do not have permission to view this booking');
            }
        }
        
        return booking;
    }

    async transitionState(id: string, nextStatus: 'pending' | 'confirmed' | 'completed' | 'canceled', user?: { userId: string, role: string }, paymentId?: string, paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'): Promise<Booking> {
        const booking = await this.findOne(id, user);
        
        // State Machine validation rules
        if (booking.status === 'canceled') {
            throw new Error('Cannot transition state of a canceled booking.');
        }
        if (booking.status === 'completed' && nextStatus !== 'completed') {
            throw new Error('Cannot change status of a completed booking.');
        }

        booking.status = nextStatus;

        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }

        if (paymentId) {
            booking.paymentId = paymentId;
            booking.paymentStatus = 'paid'; // Auto-assume paid if payment ID is attached successfully
            
            // Auto-confirm booking if payment is successful and currently pending
            if (booking.status === 'pending') {
                booking.status = 'confirmed';
            }
        }
        
        const savedBooking = await this.bookingsRepository.save(booking);

        // Notify User
        try {
            const fullBooking = await this.bookingsRepository.findOne({
                where: { id: savedBooking.id },
                relations: ['user', 'vendor', 'service'],
            });

            if (fullBooking?.user?.id) {
                const statusString = fullBooking.status.charAt(0).toUpperCase() + fullBooking.status.slice(1);
                await this.notificationsService.create({
                    userId: fullBooking.user.id,
                    type: `booking_${fullBooking.status}`,
                    title: `Booking ${statusString}`,
                    message: `Your booking for ${fullBooking.service?.title || 'a service'} is now ${fullBooking.status}.`,
                    data: { bookingId: fullBooking.id }
                });
            }
        } catch (err) {
            console.error('Failed to send notification on transition:', err);
        }

        return savedBooking;
    }

    async findAllByUserId(userId: string): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { userId },
            relations: ['vendor'],
            order: { createdAt: 'DESC' },
        });
    }

    async findAllByVendorId(vendorId: string): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { vendorId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findAllByVendorUserId(userId: string): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { vendor: { userId } },
            relations: ['user', 'vendor'],
            order: { createdAt: 'DESC' },
        });
    }
}
