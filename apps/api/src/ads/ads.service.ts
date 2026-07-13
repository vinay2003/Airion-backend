import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ad, AdStatus } from './entities/ad.entity';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ad)
    private readonly adsRepository: Repository<Ad>,
  ) {}

  async create(vendorId: string, createAdDto: CreateAdDto): Promise<Ad> {
    const newAd = this.adsRepository.create({
      ...createAdDto,
      vendorId,
      status: AdStatus.PENDING,
    });
    return await this.adsRepository.save(newAd);
  }

  async findAll(): Promise<Ad[]> {
    return await this.adsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findActiveAds(filters?: { city?: string; categoryId?: string }): Promise<Ad[]> {
    const query = this.adsRepository.createQueryBuilder('ad')
      .where('ad.status = :status', { status: AdStatus.ACTIVE })
      .andWhere('ad.startDate <= :now', { now: new Date() })
      .andWhere('ad.endDate >= :now', { now: new Date() });

    if (filters?.city) {
      query.andWhere(`ad.targetAudience->>'city' = :city`, { city: filters.city });
    }
    // Note: We could add more complex JSON filtering for categories/events here

    return await query.getMany();
  }

  async findByVendor(vendorId: string): Promise<Ad[]> {
    return await this.adsRepository.find({
      where: { vendorId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Ad> {
    const ad = await this.adsRepository.findOne({ where: { id } });
    if (!ad) {
      throw new NotFoundException(`Ad with ID ${id} not found`);
    }
    return ad;
  }

  async update(id: string, updateAdDto: UpdateAdDto): Promise<Ad> {
    const ad = await this.findOne(id);
    const updatedAd = Object.assign(ad, updateAdDto);
    return await this.adsRepository.save(updatedAd);
  }

  async remove(id: string): Promise<void> {
    const ad = await this.findOne(id);
    await this.adsRepository.remove(ad);
  }

  async incrementImpression(id: string): Promise<void> {
    await this.adsRepository.increment({ id }, 'impressions', 1);
  }

  async incrementClick(id: string): Promise<void> {
    await this.adsRepository.increment({ id }, 'clicks', 1);
  }
}
