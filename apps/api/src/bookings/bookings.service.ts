import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { WalletService } from '../wallet/wallet.service';
import { AvailabilityService } from '../availability/availability.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private readonly notificationsService: NotificationsService,
        private readonly walletService: WalletService,
        private readonly availabilityService: AvailabilityService,
    ) {}

    async create(bookingData: Partial<Booking>): Promise<Booking> {
        // --- PRODUCTION AUDIT FIX: Atomic Double-Booking Protection ---
        if (bookingData.vendorId && bookingData.eventDate) {
            const vendor = await this.availabilityService.getVendorWithUser(bookingData.vendorId);
            
            // PREVENT SELF-BOOKING
            if (vendor && vendor.userId === bookingData.userId) {
                throw new Error('Security Violation: You cannot book your own vendor profile.');
            }

            const existing = await this.bookingsRepository.findOne({
                where: {
                    vendorId: bookingData.vendorId,
                    eventDate: bookingData.eventDate,
                    status: 'confirmed', // Or other active statuses
                }
            });

            if (existing) {
                const dateStr = new Date(bookingData.eventDate).toLocaleDateString();
                throw new Error(`Vendor already has a confirmed booking on ${dateStr}. Please select another date.`);
            }
        }

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

        // --- PRODUCTION AUDIT FIX 1: Financial Idempotency (No Double Credits) ---
        if (savedBooking.paymentStatus === 'paid' && savedBooking.vendorId) {
            const alreadyPaid = await this.walletService.hasAlreadyCredited(savedBooking.id);
            if (!alreadyPaid) {
                try {
                    await this.walletService.creditEarning(
                        savedBooking.vendorId,
                        savedBooking.totalAmount,
                        savedBooking.id,
                        `Payment for booking ${savedBooking.bookingCode}`
                    );
                } catch (walletErr) {
                    console.error('[Financial Error] Wallet credit failed for booking:', savedBooking.id, walletErr);
                }
            }
        }

        // --- PRODUCTION AUDIT FIX 2: Refund Logic on Cancellation ---
        if (nextStatus === 'canceled' && savedBooking.vendorId) {
            const alreadyPaid = await this.walletService.hasAlreadyCredited(savedBooking.id);
            if (alreadyPaid) {
                try {
                    await this.walletService.debitEarning(
                        savedBooking.vendorId,
                        savedBooking.totalAmount,
                        savedBooking.id,
                        `Cancellation refund for booking ${savedBooking.bookingCode}`
                    );
                } catch (refundErr) {
                    console.error('[Financial Error] Failed to clawback funds on cancellation:', refundErr);
                }
            }

            // Unblock Calendar
            try {
                const dateString = new Date(savedBooking.eventDate).toISOString().split('T')[0];
                await this.availabilityService.unblockDate(savedBooking.vendorId, dateString);
            } catch (availErr) {
                console.error('[Availability Error] Failed to unblock date:', availErr);
            }
        }

        // --- PRODUCTION AUDIT FIX 3: Calendar Synchronization ---
        if ((nextStatus === 'confirmed' || nextStatus === 'completed') && savedBooking.vendorId && savedBooking.eventDate) {
            try {
                const dateString = new Date(savedBooking.eventDate).toISOString().split('T')[0];
                await this.availabilityService.blockDate(
                    savedBooking.vendorId, 
                    dateString, 
                    `Booking #${savedBooking.bookingCode}`,
                    'booked'
                );
            } catch (calErr) {
                console.error('[Calendar Error] Failed to block date:', calErr);
            }
        }

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
            relations: ['user', 'vendor', 'service'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * compute complex financial intelligence stats for a vendor
     */
    async getEarningsStats(userId: string) {
        const bookings = await this.bookingsRepository.find({
            where: { vendor: { userId }, paymentStatus: 'paid' },
            order: { createdAt: 'ASC' }
        });

        const totalEarnings = bookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
        const pendingPayouts = 0; // Integration with Payouts entity would go here

        // Compute Monthly Chart Data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const chartData = months.map((month, idx) => {
            const monthlyBookings = bookings.filter(b => {
                const date = new Date(b.createdAt);
                return date.getMonth() === idx && date.getFullYear() === currentYear;
            });
            return {
                name: month,
                revenue: monthlyBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0)
            };
        });

        // Recent transactions
        const transactions = bookings.slice(-5).reverse().map(b => ({
            id: `#TRX-${b.id.substring(0,6).toUpperCase()}`,
            service: b.serviceId || 'Service Protocol',
            client: 'Customer Node', // Ideally load relationship
            date: b.createdAt.toLocaleDateString(),
            amount: `₹${Number(b.totalAmount).toLocaleString()}`,
            status: 'Completed',
            method: b.paymentId ? 'System Link' : 'Direct'
        }));

        return {
            totalEarnings,
            pendingPayouts,
            chartData,
            transactions
        };
    }
}
