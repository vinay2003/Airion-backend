import { Test, TestingModule } from '@nestjs/testing';
import { AdsService } from './ads.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ad, AdStatus } from './entities/ad.entity';
import { Repository } from 'typeorm';

const mockAd = {
  id: '123',
  vendorId: 'v123',
  status: AdStatus.PENDING,
  impressions: 100,
  clicks: 5,
  startDate: new Date(),
  endDate: new Date(Date.now() + 86400000), // tomorrow
  approvedBy: null,
  approvedAt: null,
};

describe('AdsService', () => {
  let service: AdsService;
  let repository: Repository<Ad>;

  const mockAdsRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(ad => Promise.resolve({ id: Date.now().toString(), ...ad })),
    find: jest.fn().mockResolvedValue([mockAd]),
    findOne: jest.fn().mockResolvedValue(mockAd),
    remove: jest.fn().mockResolvedValue(undefined),
    increment: jest.fn().mockResolvedValue(undefined),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockAd]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdsService,
        {
          provide: getRepositoryToken(Ad),
          useValue: mockAdsRepository,
        },
      ],
    }).compile();

    service = module.get<AdsService>(AdsService);
    repository = module.get<Repository<Ad>>(getRepositoryToken(Ad));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Campaign Lifecycle', () => {
    it('should approve a campaign and set active status', async () => {
      const adminId = 'admin1';
      const approvedAd = await service.approveCampaign('123', adminId);
      
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(approvedAd.status).toEqual(AdStatus.ACTIVE);
      expect(approvedAd.approvedBy).toEqual(adminId);
      expect(approvedAd.approvedAt).toBeInstanceOf(Date);
      expect(repository.save).toHaveBeenCalledWith(approvedAd);
    });

    it('should reject a campaign', async () => {
      const adminId = 'admin1';
      const rejectedAd = await service.rejectCampaign('123', adminId);
      
      expect(rejectedAd.status).toEqual(AdStatus.REJECTED);
      expect(rejectedAd.approvedBy).toEqual(adminId);
    });

    it('should expire a campaign manually', async () => {
      const expiredAd = await service.expireCampaign('123');
      expect(expiredAd.status).toEqual(AdStatus.EXPIRED);
    });
  });

  describe('CTR Calculation', () => {
    it('should calculate correct CTR', () => {
      expect(service.calculateCTR(100, 5)).toEqual(5);
      expect(service.calculateCTR(1000, 15)).toEqual(1.5);
      expect(service.calculateCTR(0, 5)).toEqual(0); // Prevents divide by zero
    });
  });

  describe('Cron Job', () => {
    it('should expire ads that passed end date', async () => {
      await service.checkExpiredAds();
      expect(mockAdsRepository.createQueryBuilder).toHaveBeenCalled();
      // Since mock returns [mockAd], it should save it with EXPIRED status
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        status: AdStatus.EXPIRED
      }));
    });
  });
});
