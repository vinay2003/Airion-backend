import { Injectable, NotFoundException } from '@nestjs/common';
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

    async findOne(id: string): Promise<Booking> {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['user', 'vendor'], // Include relevant related data
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }

    async updateStatus(id: string, status: string, paymentId?: string): Promise<Booking> {
        const booking = await this.findOne(id);
        booking.status = status;
        if (paymentId) {
            booking.paymentId = paymentId;
            booking.paymentStatus = 'paid'; // Set if verification is doing this
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
}
