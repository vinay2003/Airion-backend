import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefundRequest, RefundStatus } from './entities/refund-request.entity';

@Injectable()
export class RefundsService {
    constructor(
        @InjectRepository(RefundRequest)
        private readonly refundRepository: Repository<RefundRequest>,
    ) {}

    /**
     * User submits a refund request for a cancelled booking.
     */
    async createRefundRequest(
        userId: string,
        data: {
            bookingId: string;
            bookingAmount: number;
            reason?: string;
            bankName: string;
            accountNumber: string;
            ifscCode: string;
        },
    ): Promise<RefundRequest> {
        // Prevent duplicate requests
        const existing = await this.refundRepository.findOne({
            where: { bookingId: data.bookingId, userId },
        });
        if (existing) {
            throw new BadRequestException('A refund request for this booking already exists.');
        }

        const refundAmount = data.bookingAmount * 0.8; // 80% refund, 20% cancellation fee

        const refundRequest = this.refundRepository.create({
            bookingId: data.bookingId,
            userId,
            bookingAmount: data.bookingAmount,
            refundAmount,
            reason: data.reason,
            bankName: data.bankName,
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
            status: RefundStatus.PENDING,
        });

        return this.refundRepository.save(refundRequest);
    }

    /**
     * Get all refund requests for a specific user.
     */
    async getUserRefunds(userId: string): Promise<RefundRequest[]> {
        return this.refundRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Get a single refund request by ID (user can only see their own).
     */
    async getRefundById(id: string, userId: string, isAdmin = false): Promise<RefundRequest> {
        const refund = await this.refundRepository.findOne({ where: { id } });
        if (!refund) throw new NotFoundException('Refund request not found');
        if (!isAdmin && refund.userId !== userId) {
            throw new ForbiddenException('You are not authorized to view this refund request');
        }
        return refund;
    }

    /**
     * Admin: Get all pending/all refund requests.
     */
    async getAllRefunds(status?: RefundStatus): Promise<RefundRequest[]> {
        const where = status ? { status } : {};
        return this.refundRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Admin: Approve a refund request.
     */
    async approveRefund(id: string, adminId: string, adminRemark?: string): Promise<RefundRequest> {
        const refund = await this.refundRepository.findOne({ where: { id } });
        if (!refund) throw new NotFoundException('Refund request not found');
        if (refund.status !== RefundStatus.PENDING) {
            throw new BadRequestException('Refund request has already been processed');
        }

        refund.status = RefundStatus.APPROVED;
        refund.adminRemark = adminRemark || '';
        refund.approvedBy = adminId;
        refund.approvedAt = new Date();
        return this.refundRepository.save(refund);
    }

    /**
     * Admin: Reject a refund request.
     */
    async rejectRefund(id: string, adminId: string, adminRemark: string): Promise<RefundRequest> {
        const refund = await this.refundRepository.findOne({ where: { id } });
        if (!refund) throw new NotFoundException('Refund request not found');
        if (refund.status !== RefundStatus.PENDING) {
            throw new BadRequestException('Refund request has already been processed');
        }

        refund.status = RefundStatus.REJECTED;
        refund.adminRemark = adminRemark;
        refund.approvedBy = adminId;
        refund.approvedAt = new Date();
        return this.refundRepository.save(refund);
    }

    /**
     * Admin: Mark a refund as actually transferred/processed.
     */
    async markProcessed(id: string, adminId: string): Promise<RefundRequest> {
        const refund = await this.refundRepository.findOne({ where: { id } });
        if (!refund) throw new NotFoundException('Refund request not found');
        if (refund.status !== RefundStatus.APPROVED) {
            throw new BadRequestException('Refund must be approved before marking as processed');
        }
        refund.status = RefundStatus.PROCESSED;
        refund.completedAt = new Date();
        // optionally log adminId for this action as well if needed.
        return this.refundRepository.save(refund);
    }
}
