import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Vendor } from '../vendors/entities/vendor.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        @InjectRepository(Vendor)
        private readonly vendorRepository: Repository<Vendor>,
    ) { }

    async create(userId: string, createDto: { bookingId: string; rating: number; reviewText?: string; images?: string[] }): Promise<Review> {
        // 1. Verify booking belongs to user
        const booking = await this.bookingRepository.findOne({
            where: { id: createDto.bookingId, userId },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found or does not belong to you');
        }

        // 2. Check if review already exists for this booking (since it is OneToOne unique)
        const existingReview = await this.reviewRepository.findOne({ where: { bookingId: createDto.bookingId } });
        if (existingReview) {
            throw new ConflictException('You have already submitted a review for this booking');
        }

        // 3. Create Review
        const review = this.reviewRepository.create({
            bookingId: createDto.bookingId,
            userId,
            vendorId: booking.vendorId,
            serviceId: booking.serviceId, // Make sure booking holds serviceId
            rating: createDto.rating,
            reviewText: createDto.reviewText,
            images: createDto.images || [],
        });

        const savedReview = await this.reviewRepository.save(review);

        // 4. Update Vendor aggregations (Rating and reviewer totals)
        await this.updateVendorStats(booking.vendorId);

        return savedReview;
    }

    private async updateVendorStats(vendorId: string): Promise<void> {
        const reviews = await this.reviewRepository.find({ where: { vendorId, isApproved: true } });
        
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = totalRating / reviews.length;

            await this.vendorRepository.update(vendorId, {
                rating: parseFloat(averageRating.toFixed(2)),
                totalReviews: reviews.length,
            });
        }
    }

    async findByService(serviceId: string): Promise<Review[]> {
        return this.reviewRepository.find({
            where: { serviceId, isApproved: true },
            relations: ['user'], // Join user name for display
            order: { createdAt: 'DESC' },
        });
    }

    async findByVendor(vendorId: string): Promise<Review[]> {
        return this.reviewRepository.find({
            where: { vendorId, isApproved: true },
            relations: ['user', 'service'],
            order: { createdAt: 'DESC' },
        });
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const review = await this.reviewRepository.findOne({ where: { id, userId } });
        if (!review) {
             throw new NotFoundException('Review not found or not owned by you');
        }
        const vendorId = review.vendorId;
        await this.reviewRepository.remove(review);
        await this.updateVendorStats(vendorId);
        return true;
    }
}
