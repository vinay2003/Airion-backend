import { Test, TestingModule } from '@nestjs/testing';
import { RefundsService } from './refunds.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefundRequest, RefundStatus } from './entities/refund-request.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockRefund = {
    id: 'r123',
    bookingId: 'b123',
    userId: 'u123',
    bookingAmount: 1000,
    refundAmount: 800,
    reason: 'Cancellation',
    bankName: 'Test Bank',
    accountNumber: '123456789',
    ifscCode: 'TEST0001',
    status: RefundStatus.PENDING,
    adminRemark: null,
    approvedBy: null,
    approvedAt: null,
    completedAt: null,
};

describe('RefundsService', () => {
    let service: RefundsService;
    let repository: Repository<RefundRequest>;

    const mockRepository = {
        create: jest.fn().mockImplementation(dto => dto),
        save: jest.fn().mockImplementation(refund => Promise.resolve({ id: 'r123', ...refund })),
        findOne: jest.fn().mockResolvedValue(mockRefund),
        find: jest.fn().mockResolvedValue([mockRefund]),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RefundsService,
                {
                    provide: getRepositoryToken(RefundRequest),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<RefundsService>(RefundsService);
        repository = module.get<Repository<RefundRequest>>(getRepositoryToken(RefundRequest));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Admin Actions', () => {
        it('should approve a refund request', async () => {
            const adminId = 'admin1';
            const remark = 'Approved after verification';
            
            mockRepository.findOne.mockResolvedValueOnce({ ...mockRefund, status: RefundStatus.PENDING });
            
            const approved = await service.approveRefund('r123', adminId, remark);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'r123' } });
            expect(approved.status).toEqual(RefundStatus.APPROVED);
            expect(approved.adminRemark).toEqual(remark);
            expect(approved.approvedBy).toEqual(adminId);
            expect(approved.approvedAt).toBeInstanceOf(Date);
        });

        it('should reject a refund request', async () => {
            const adminId = 'admin1';
            const remark = 'Invalid details';
            
            mockRepository.findOne.mockResolvedValueOnce({ ...mockRefund, status: RefundStatus.PENDING });
            
            const rejected = await service.rejectRefund('r123', adminId, remark);

            expect(rejected.status).toEqual(RefundStatus.REJECTED);
            expect(rejected.adminRemark).toEqual(remark);
            expect(rejected.approvedBy).toEqual(adminId);
            expect(rejected.approvedAt).toBeInstanceOf(Date);
        });

        it('should fail to approve if not pending', async () => {
            mockRepository.findOne.mockResolvedValueOnce({ ...mockRefund, status: RefundStatus.PROCESSED });
            
            await expect(service.approveRefund('r123', 'admin1')).rejects.toThrow(BadRequestException);
        });

        it('should mark as processed if approved', async () => {
            mockRepository.findOne.mockResolvedValueOnce({ ...mockRefund, status: RefundStatus.APPROVED });
            
            const processed = await service.markProcessed('r123', 'admin1');
            expect(processed.status).toEqual(RefundStatus.PROCESSED);
            expect(processed.completedAt).toBeInstanceOf(Date);
        });

        it('should fail to mark processed if not approved', async () => {
            mockRepository.findOne.mockResolvedValueOnce({ ...mockRefund, status: RefundStatus.PENDING });
            await expect(service.markProcessed('r123', 'admin1')).rejects.toThrow(BadRequestException);
        });
    });
});
