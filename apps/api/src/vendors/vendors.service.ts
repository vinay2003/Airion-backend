import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { Activity, ActivityType } from './entities/activity.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { User } from '../auth/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
        @InjectRepository(Activity)
        private activityRepository: Repository<Activity>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async create(createVendorDto: CreateVendorDto, user: User): Promise<Vendor> {
        // Check if user is already a vendor
        const existingVendor = await this.vendorRepository.findOne({
            where: { userId: user.id },
        });

        if (existingVendor) {
            throw new BadRequestException('User is already registered as a vendor');
        }

        const vendor = new Vendor();
        Object.assign(vendor, {
            ...(createVendorDto as Record<string, any>),
            userId: user.id,
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
        const vendor = await this.vendorRepository.findOne({
            where: { userId },
            relations: ['user', 'category', 'subcategory'],
        });

        return vendor;
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
}
