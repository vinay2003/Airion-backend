import { Test, TestingModule } from '@nestjs/testing';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('VendorsController', () => {
  let controller: VendorsController;
  let vendorsService: VendorsService;

  const mockVendorsService = {
    getDiscovery: jest.fn().mockResolvedValue({
      vendors: [{ id: 'v1', isSponsored: true }, { id: 'v2', isSponsored: false }],
      total: 2,
    }),
  };

  const mockAnalyticsService = {
    trackEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorsController],
      providers: [
        {
          provide: VendorsService,
          useValue: mockVendorsService,
        },
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<VendorsController>(VendorsController);
    vendorsService = module.get<VendorsService>(VendorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDiscovery', () => {
    it('should parse query parameters correctly and pass them to VendorsService', async () => {
      const city = 'Mumbai';
      const categoryId = 'cat1';
      const search = 'Wedding';
      const sponsored = 'true';
      const limit = '10';
      const offset = '5';

      const result = await controller.getDiscovery(city, categoryId, search, sponsored, limit, offset);

      expect(vendorsService.getDiscovery).toHaveBeenCalledWith({
        city: 'Mumbai',
        categoryId: 'cat1',
        search: 'Wedding',
        sponsored: true,
        limit: 10,
        offset: 5,
      });
      expect(result.total).toEqual(2);
      expect(result.vendors.length).toEqual(2);
    });

    it('should use default values if parameters are missing', async () => {
      await controller.getDiscovery(undefined, undefined, undefined, undefined, undefined, undefined);

      expect(vendorsService.getDiscovery).toHaveBeenCalledWith({
        city: undefined,
        categoryId: undefined,
        search: undefined,
        sponsored: undefined,
        limit: 20, // default limit
        offset: 0, // default offset
      });
    });
  });
});
