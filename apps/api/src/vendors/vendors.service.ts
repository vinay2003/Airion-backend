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

    /**
     * Complete vendor onboarding — saves business details and marks profile as complete.
     * Called after vendor signup, from the onboarding form.
     */
    async completeOnboarding(userId: string, dto: {
        businessName: string;
        gstNumber?: string;
        businessEmail?: string;
        address?: string;
        services?: string;
        businessDescription?: string;
    }): Promise<{ vendor: Vendor; isProfileComplete: boolean }> {
        // Find or create vendor record for this user
        let vendor = await this.vendorRepository.findOne({ where: { userId } });

        if (!vendor) {
            vendor = this.vendorRepository.create({ userId }) as Vendor;
        }

        // Assign onboarding fields
        Object.assign(vendor, {
            businessName: dto.businessName,
            gstNumber: dto.gstNumber || null,
            businessEmail: dto.businessEmail || null,
            businessAddress: dto.address ? { street: dto.address, city: '', state: '', country: 'India', zipCode: '' } : null,
            businessDescription: dto.businessDescription || null,
            isProfileComplete: true,
            verificationStatus: vendor.verificationStatus || 'pending',
        });

        const saved = await this.vendorRepository.save(vendor);
        return { vendor: saved, isProfileComplete: true };
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
        const revenueTotal = bookings
            .filter(b => b.status === 'completed' || b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + Number(b.totalAmount), 0);

        return {
            pendingBookings: pending,
            totalEvents: events,
            upcomingBookings: upcoming,
            totalEarnings: revenueTotal.toLocaleString('en-IN')
        };
    }

    async getDetailedEarnings(vendorId: string): Promise<any> {
        const bookings = await this.bookingRepository.find({
            where: { vendorId },
            order: { createdAt: 'DESC' }
        });

        const completedBookings = bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'paid');
        
        // Calculate revenue stats
        const totalBalance = completedBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
        
        // Monthly trend (last 6 months)
        const monthlyStats = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthLabel = monthNames[date.getMonth()];
            const monthYear = date.getFullYear();
            
            const monthRevenue = completedBookings
                .filter(b => {
                    const bDate = new Date(b.createdAt);
                    return bDate.getMonth() === date.getMonth() && bDate.getFullYear() === monthYear;
                })
                .reduce((sum, b) => sum + Number(b.totalAmount), 0);
                
            monthlyStats.push({ name: monthLabel, revenue: monthRevenue });
        }

        // Transactions (transformed for frontend)
        const transactions = bookings.slice(0, 10).map(b => ({
            id: `#TRX-${b.id?.split('-')[0].toUpperCase()}`,
            service: 'Service Booking', // Should ideally fetch service title
            client: 'Customer', // Should ideally fetch user name
            date: new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            amount: `₹${Number(b.totalAmount).toLocaleString('en-IN')}`,
            status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
        }));

        return {
            totalBalance,
            monthlyRevenue: monthlyStats[monthlyStats.length - 1].revenue,
            monthlyStats,
            recentTransactions: transactions
        };
    }

    // --- ADS MANAGEMENT ---

    async createAd(userId: string, adData: any): Promise<Vendor> {
        const vendor = await this.findByUserId(userId);
        if (!vendor) throw new NotFoundException('Vendor profile not found');

        const newAd = {
            id: Math.random().toString(36).substr(2, 9),
            ...adData,
            status: 'Pending',
            createdAt: new Date(),
        };

        vendor.ads = [...(vendor.ads || []), newAd];
        return this.vendorRepository.save(vendor);
    }

    async updateAd(userId: string, adId: string, updateData: any): Promise<Vendor> {
        const vendor = await this.findByUserId(userId);
        if (!vendor) throw new NotFoundException('Vendor profile not found');

        vendor.ads = (vendor.ads || []).map(ad => 
            ad.id === adId ? { ...ad, ...updateData } : ad
        );
        return this.vendorRepository.save(vendor);
    }

    // --- GALLERY MANAGEMENT ---

    async addToGallery(userId: string, item: any): Promise<Vendor> {
        const vendor = await this.findByUserId(userId);
        if (!vendor) throw new NotFoundException('Vendor profile not found');

        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            ...item,
            createdAt: new Date(),
        };

        vendor.gallery = [...(vendor.gallery || []), newItem];
        return this.vendorRepository.save(vendor);
    }

    async removeFromGallery(userId: string, itemId: string): Promise<Vendor> {
        const vendor = await this.findByUserId(userId);
        if (!vendor) throw new NotFoundException('Vendor profile not found');

        vendor.gallery = (vendor.gallery || []).filter(item => item.id !== itemId);
        return this.vendorRepository.save(vendor);
    }
}
