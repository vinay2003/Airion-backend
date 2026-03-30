import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
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
        return this.bookingsRepository.save(booking);
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
        
        return this.bookingsRepository.save(booking);
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
