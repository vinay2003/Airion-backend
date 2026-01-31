import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
    ) { }

    async create(createVendorDto: CreateVendorDto, user: User): Promise<Vendor> {
        // Check if user is already a vendor
        const existingVendor = await this.vendorRepository.findOne({
            where: { userId: user.id },
        });

        if (existingVendor) {
            throw new BadRequestException('User is already registered as a vendor');
        }

        const vendor = this.vendorRepository.create({
            ...createVendorDto,
            userId: user.id,
        });

        return this.vendorRepository.save(vendor);
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
}
