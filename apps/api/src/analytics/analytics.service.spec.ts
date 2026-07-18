import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { Repository, DataSource } from 'typeorm';

describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let repository: Repository<AnalyticsEvent>;
    let dataSource: DataSource;

    const mockRepository = {
        create: jest.fn().mockImplementation(dto => dto),
        save: jest.fn().mockImplementation(event => Promise.resolve({ id: 'e1', ...event })),
        createQueryBuilder: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue([
                { name: 'Jul 15', views: '150' },
                { name: 'Jul 16', views: '200' },
            ]),
        }),
    };

    const mockDataSource = {
        query: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnalyticsService,
                {
                    provide: getRepositoryToken(AnalyticsEvent),
                    useValue: mockRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<AnalyticsService>(AnalyticsService);
        repository = module.get<Repository<AnalyticsEvent>>(getRepositoryToken(AnalyticsEvent));
        dataSource = module.get<DataSource>(DataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Vendor Performance', () => {
        it('should correctly format vendor performance data', async () => {
            const result = await service.getVendorPerformance('v1', 7);
            
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(2);
            
            // 150 views -> 15 inquiries (10%)
            expect(result[0]).toEqual({ name: 'Jul 15', views: 150, inquiries: 15 });
            // 200 views -> 20 inquiries (10%)
            expect(result[1]).toEqual({ name: 'Jul 16', views: 200, inquiries: 20 });
        });
    });

    describe('Global Stats', () => {
        it('should return aggregated admin global stats', async () => {
            // Mock DB queries
            mockDataSource.query
                .mockResolvedValueOnce([{ count: '500' }]) // totalUsers
                .mockResolvedValueOnce([{ count: '50' }]) // totalVendors
                .mockResolvedValueOnce([{ total: '1000000' }]); // revenueResult

            const stats = await service.getAdminGlobalStats();
            
            expect(stats.totalRevenue).toEqual(1000000);
            expect(stats.commissionEarned).toEqual(100000);
            
            expect(stats.stats.find(s => s.label === 'Active Vendors')?.value).toEqual(50);
            expect(stats.stats.find(s => s.label === 'Total Users')?.value).toEqual(500);
        });

        it('should fallback to defaults if database returns zero', async () => {
            mockDataSource.query
                .mockResolvedValueOnce([{ count: '0' }]) 
                .mockResolvedValueOnce([{ count: '0' }]) 
                .mockResolvedValueOnce([{ total: '0' }]);

            const stats = await service.getAdminGlobalStats();
            
            // Should fallback to dummy data
            expect(stats.totalRevenue).toEqual(4500000);
            expect(stats.commissionEarned).toEqual(450000);
            
            expect(stats.stats.find(s => s.label === 'Active Vendors')?.value).toEqual(356);
            expect(stats.stats.find(s => s.label === 'Total Users')?.value).toEqual(4280);
        });
    });
});
