import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispute } from './entities/dispute.entity';
import { Vendor } from '../vendors/entities/vendor.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Dispute)
        private readonly disputeRepository: Repository<Dispute>,
        @InjectRepository(Vendor)
        private readonly vendorRepository: Repository<Vendor>,
    ) { }

    async updateVendorStatus(vendorId: string, status: 'approved' | 'rejected') {
        const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
        if (!vendor) throw new NotFoundException('Vendor not found');

        vendor.verificationStatus = status;
        vendor.isVerified = status === 'approved';
        return this.vendorRepository.save(vendor);
    }

    async suspendVendor(vendorId: string) {
        const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
        if (!vendor) throw new NotFoundException('Vendor not found');

        vendor.isVerified = false;
        vendor.verificationStatus = 'rejected';
        // Add a 'is_suspended' flag in future if needed
        return this.vendorRepository.save(vendor);
    }

    async createDispute(data: { bookingId: string; raisedById: string; reason: string }) {
        const dispute = this.disputeRepository.create(data);
        return this.disputeRepository.save(dispute);
    }

    async resolveDispute(id: string, resolution: string, refundAmount: number = 0) {
        const dispute = await this.disputeRepository.findOne({ where: { id } });
        if (!dispute) throw new NotFoundException('Dispute not found');
        
        dispute.status = 'resolved';
        dispute.adminResolution = resolution;
        dispute.refundAmount = refundAmount;
        
        return this.disputeRepository.save(dispute);
    }

    async getDisputes(status?: string) {
        return this.disputeRepository.find({
            where: status ? { status } : {},
            relations: ['booking', 'raisedBy'],
            order: { createdAt: 'DESC' },
        });
    }
}
