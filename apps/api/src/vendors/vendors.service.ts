import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { Activity, ActivityType } from './entities/activity.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { User } from '../auth/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
        @InjectRepository(Activity)
        private activityRepository: Repository<Activity>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
    ) { }

    async create(createVendorDto: CreateVendorDto, user: { userId: string }): Promise<Vendor> {
        // Check if user is already a vendor
        const existingVendor = await this.vendorRepository.findOne({
            where: { userId: user.userId },
        });

        if (existingVendor) {
            throw new BadRequestException('User is already registered as a vendor');
        }

        const vendor = new Vendor();
        Object.assign(vendor, {
            ...(createVendorDto as Record<string, any>),
            userId: user.userId,
            verificationStatus: 'pending',
            isVerified: false,
        });

        return this.vendorRepository.save(vendor);
    }

    async trackActivity(userId: string, type: ActivityType, targetId?: string, metadata?: any): Promise<Activity> {
        const activity = this.activityRepository.create({
            userId,
            type,
            targetId,
            metadata,
        });
        return this.activityRepository.save(activity);
    }

    async findOne(id: string): Promise<Vendor> {
        const vendor = await this.vendorRepository.findOne({
            where: { id },
            relations: ['user', 'category', 'subcategory'],
        });

        if (!vendor) {
            throw new NotFoundException(`Vendor with ID ${id} not found`);
        }

        return vendor;
    }

    async findByUserId(userId: string): Promise<Vendor | null> {
        if (!userId) {
            console.warn('[VendorsService] Attempted to find vendor with null/undefined userId');
            return null;
        }

        try {
            const vendor = await this.vendorRepository.findOne({
                where: { userId },
                relations: ['user', 'category', 'subcategory'],
            });

            return vendor || null;
        } catch (error) {
            console.error(`[VendorsService] Error finding vendor by userId: ${userId}`, error);
            // We return null instead of throwing to prevent 500 errors in "me" endpoints
            return null;
        }
    }

    async update(id: string, updateVendorDto: Partial<CreateVendorDto>, userId: string): Promise<Vendor> {
        const vendor = await this.findOne(id);

        // Ensure the user owns this vendor profile
        if (vendor.userId !== userId) {
            throw new BadRequestException('You can only update your own vendor profile');
        }

        Object.assign(vendor, updateVendorDto);

        return this.vendorRepository.save(vendor);
    }

    async findAll(status?: string): Promise<Vendor[]> {
        const query = this.vendorRepository.createQueryBuilder('vendor')
            .leftJoinAndSelect('vendor.user', 'user')
            .leftJoinAndSelect('vendor.category', 'category');

        if (status) {
            query.where('vendor.verificationStatus = :status', { status });
        }

        return query.getMany();
    }

    async updateStatus(id: string, status: string): Promise<Vendor> {
        const vendor = await this.findOne(id);
        vendor.verificationStatus = status;
        if (status === 'approved') {
            vendor.isVerified = true;
        } else if (status === 'rejected') {
            vendor.isVerified = false;
        }
        return this.vendorRepository.save(vendor);
    }

    async getVendorStats(vendorId: string): Promise<any> {
        const bookings = await this.bookingRepository.find({ 
            where: { vendorId },
            order: { createdAt: 'DESC' }
        });

        // Current business logic for stats
        const pending = bookings.filter(b => b.status === 'pending').length;
        const upcoming = bookings.filter(b => b.status === 'confirmed').length;
        const events = bookings.filter(b => b.status === 'completed').length;
        const revenue = bookings
            .filter(b => b.status === 'completed' || b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + Number(b.totalAmount), 0);

        return {
            pendingBookings: pending,
            totalEvents: events,
            upcomingBookings: upcoming,
            totalEarnings: revenue.toLocaleString('en-IN')
        };
    }
}
