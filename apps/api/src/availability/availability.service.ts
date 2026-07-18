import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from './entities/availability.entity';
import { Vendor } from '../vendors/entities/vendor.entity';

@Injectable()
export class AvailabilityService {
    constructor(
        @InjectRepository(Availability)
        private readonly availabilityRepository: Repository<Availability>,
        @InjectRepository(Vendor)
        private readonly vendorRepository: Repository<Vendor>,
    ) {}

    async getVendorSchedule(vendorId: string, month: string) {
        // Fetch blocks for a specific month
        return this.availabilityRepository.find({
            where: { vendorId },
            order: { date: 'ASC' },
        });
    }

    async blockDate(vendorId: string, date: string, reason?: string, status: string = 'blocked') {
        const existings = await this.availabilityRepository.find({
            where: { vendorId, date },
        });

        if (existings.some(e => e.status === 'booked')) {
            throw new BadRequestException('Cannot block a date that is already booked');
        }

        const block = this.availabilityRepository.create({
            vendorId,
            date,
            status,
            reason,
        });

        return this.availabilityRepository.save(block);
    }

    async unblockDate(vendorId: string, id: string) {
        const block = await this.availabilityRepository.findOne({
            where: { vendorId, id },
        });

        if (!block) return true;
        if (block.status === 'booked') {
            throw new BadRequestException('Cannot unblock a date with an active booking. Please cancel the booking first.');
        }

        await this.availabilityRepository.remove(block);
        return true;
    }

    async isAvailable(vendorId: string, date: string): Promise<boolean> {
        const block = await this.availabilityRepository.findOne({
            where: { vendorId, date },
        });

        return !block || block.status === 'available';
    }

    async getVendorWithUser(vendorId: string) {
        return this.vendorRepository.findOne({
            where: { id: vendorId },
            relations: ['user']
        });
    }

    async checkAvailability(vendorId: string, date: string): Promise<boolean> {
        return this.isAvailable(vendorId, date);
    }
}
