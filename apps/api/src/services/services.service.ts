import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { ServicePackage } from './entities/service-package.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
        @InjectRepository(ServicePackage)
        private readonly packageRepository: Repository<ServicePackage>,
    ) { }

    async create(createServiceDto: CreateServiceDto, vendorId?: string): Promise<Service> {
        // Vendor verification
        const targetVendorId = vendorId || createServiceDto.vendorId;

        if (!targetVendorId) {
            throw new BadRequestException('Vendor ID is required');
        }

        const slug = await this.generateUniqueSlug(createServiceDto.title);

        const service = this.serviceRepository.create({
            ...createServiceDto,
            vendorId: targetVendorId,
            slug,
        });

        return this.serviceRepository.save(service);
    }

    private async generateUniqueSlug(title: string): Promise<string> {
        let slug = title.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '') // Remove anomalies
            .replace(/[\s_]+/g, '-')  // Replace spaces/underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Trim border hyphens

        let count = 0;
        let finalSlug = slug;
        while (count < 10) { // Safety loop 
            const check = await this.serviceRepository.findOne({ where: { slug: finalSlug } });
            if (!check) return finalSlug;
            count++;
            finalSlug = `${slug}-${Math.floor(Math.random() * 1000 + count)}`;
        }
        return finalSlug;
    }

    async findAll(query: { category?: string; vendorId?: string; search?: string; location?: string; priceMin?: number; priceMax?: number; rating?: number; limit?: number; offset?: number; sort?: string; order?: 'ASC' | 'DESC' }) {
        const qb = this.serviceRepository.createQueryBuilder('service')
            .leftJoinAndSelect('service.vendor', 'vendor')
            .leftJoinAndSelect('service.category', 'category')
            .leftJoinAndSelect('service.packages', 'packages')
            .where('service.isActive = :active', { active: true });

        if (query.category) {
            qb.andWhere('category.slug = :catSlug OR category.id::text = :catId', { catSlug: query.category, catId: query.category });
        }

        if (query.vendorId) {
            qb.andWhere('service.vendorId = :vId', { vId: query.vendorId });
        }

        if (query.search) {
            qb.andWhere('(service.title ILIKE :search OR service.description ILIKE :search)', { search: `%${query.search}%` });
        }

        if (query.location) {
            qb.andWhere('(service.city ILIKE :loc OR :loc = ANY(service.availableLocations))', { loc: `%${query.location}%` });
        }

        if (query.priceMin !== undefined) {
            qb.andWhere('service.basePrice >= :priceMin', { priceMin: query.priceMin });
        }

        if (query.priceMax !== undefined) {
            qb.andWhere('service.basePrice <= :priceMax', { priceMax: query.priceMax });
        }

        if (query.rating !== undefined) {
            qb.andWhere('vendor.rating >= :rating', { rating: query.rating });
        }

        // Sorting
        if (query.sort) {
            const orderPrefix = query.sort.includes('.') ? '' : 'service.';
            qb.orderBy(`${orderPrefix}${query.sort}`, query.order || 'ASC');
        } else {
            qb.orderBy('service.createdAt', 'DESC');
        }

        // Pagination
        const limit = query.limit ? Math.min(query.limit, 100) : 10;
        const offset = query.offset || 0;
        qb.take(limit).skip(offset);

        const [data, total] = await qb.getManyAndCount();
        return { success: true, data, meta: { total, limit, offset } };
    }

    async findOne(idOrSlug: string): Promise<Service> {
        try {
            // Check if input is a valid UUID
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
            
            const where = isUuid 
                ? [{ id: idOrSlug }, { slug: idOrSlug }] 
                : [{ slug: idOrSlug }];

            const service = await this.serviceRepository.findOne({
                where,
                relations: ['vendor', 'category', 'packages'],
            });

            if (!service) {
                throw new NotFoundException(`Service with identifier "${idOrSlug}" not found`);
            }
            return service;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            
            // Log for internal tracking but throw a controlled exception
            console.error('[ServicesService] Database Query Error:', error);
            throw new NotFoundException(`Service not found or invalid identifier format`);
        }
    }

    async update(id: string, updateDto: Partial<CreateServiceDto>): Promise<Service> {
        const service = await this.findOne(id);
        Object.assign(service, updateDto);
        return this.serviceRepository.save(service);
    }

    async delete(id: string): Promise<boolean> {
        const service = await this.findOne(id);
        await this.serviceRepository.remove(service);
        return true;
    }
}
