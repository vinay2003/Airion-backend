import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';
import { User } from '../../auth/entities/user.entity';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createVendorProfile(userId: string, createVendorDto: CreateVendorDto): Promise<Vendor> {
        // Check if user exists
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if vendor profile already exists for this user
        const existingVendor = await this.vendorRepository.findOne({ where: { userId } });
        if (existingVendor) {
            throw new BadRequestException('Vendor profile already exists for this user');
        }

        // Create vendor profile
        const vendor = this.vendorRepository.create({
            ...createVendorDto,
            userId,
            user,
        });

        const savedVendor = await this.vendorRepository.save(vendor);

        // Update user role to VENDOR
        user.role = Role.VENDOR;
        await this.userRepository.save(user);

        return savedVendor;
    }

    async getVendorById(id: string): Promise<Vendor> {
        const vendor = await this.vendorRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        return vendor;
    }

    async getVendorByUserId(userId: string): Promise<Vendor> {
        const vendor = await this.vendorRepository.findOne({
            where: { userId },
            relations: ['user'],
        });

        if (!vendor) {
            throw new NotFoundException('Vendor profile not found for this user');
        }

        return vendor;
    }

    async updateVendor(id: string, userId: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
        const vendor = await this.vendorRepository.findOne({ where: { id } });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        // Ensure the user owns this vendor profile
        if (vendor.userId !== userId) {
            throw new BadRequestException('You can only update your own vendor profile');
        }

        Object.assign(vendor, updateVendorDto);
        return await this.vendorRepository.save(vendor);
    }

    async getAllVendors(filters?: {
        city?: string;
        businessType?: string;
        isApproved?: boolean;
        isActive?: boolean;
    }): Promise<Vendor[]> {
        const query = this.vendorRepository.createQueryBuilder('vendor')
            .leftJoinAndSelect('vendor.user', 'user');

        if (filters) {
            if (filters.city) {
                query.andWhere('vendor.city = :city', { city: filters.city });
            }
            if (filters.businessType) {
                query.andWhere('vendor.businessType = :businessType', { businessType: filters.businessType });
            }
            if (filters.isApproved !== undefined) {
                query.andWhere('vendor.isApproved = :isApproved', { isApproved: filters.isApproved });
            }
            if (filters.isActive !== undefined) {
                query.andWhere('vendor.isActive = :isActive', { isActive: filters.isActive });
            }
        }

        return await query.getMany();
    }

    async getVendorStats(): Promise<{
        total: number;
        approved: number;
        pending: number;
        byBusinessType: Record<string, number>;
        byChallenges: Record<string, number>;
    }> {
        const vendors = await this.vendorRepository.find();

        const stats = {
            total: vendors.length,
            approved: vendors.filter((v: Vendor) => v.isApproved).length,
            pending: vendors.filter((v: Vendor) => !v.isApproved).length,
            byBusinessType: {} as Record<string, number>,
            byChallenges: {} as Record<string, number>,
        };

        // Count by business type
        vendors.forEach((vendor: Vendor) => {
            const type = vendor.businessType;
            stats.byBusinessType[type] = (stats.byBusinessType[type] || 0) + 1;

            // Count challenges
            vendor.challenges.forEach((challenge: string) => {
                stats.byChallenges[challenge] = (stats.byChallenges[challenge] || 0) + 1;
            });
        });

        return stats;
    }

    async approveVendor(id: string): Promise<Vendor> {
        const vendor = await this.getVendorById(id);
        vendor.isApproved = true;
        return await this.vendorRepository.save(vendor);
    }

    async deactivateVendor(id: string): Promise<Vendor> {
        const vendor = await this.getVendorById(id);
        vendor.isActive = false;
        return await this.vendorRepository.save(vendor);
    }
}
