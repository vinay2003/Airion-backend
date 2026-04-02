import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
    constructor(
        @InjectRepository(Wishlist)
        private wishlistsRepository: Repository<Wishlist>,
    ) {}

    async toggleWishlist(userId: string, vendorId: string): Promise<{ wishlisted: boolean }> {
        const existing = await this.wishlistsRepository.findOne({ where: { userId, vendorId } });
        
        if (existing) {
            await this.wishlistsRepository.remove(existing);
            return { wishlisted: false };
        } else {
            const newItem = this.wishlistsRepository.create({ userId, vendorId });
            await this.wishlistsRepository.save(newItem);
            return { wishlisted: true };
        }
    }

    async getUserWishlist(userId: string): Promise<Wishlist[]> {
        return this.wishlistsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
            // relations: ['vendor'] // uncomment when vendor entity is fully mapped
        });
    }

    async checkIsWishlisted(userId: string, vendorId: string): Promise<boolean> {
        const count = await this.wishlistsRepository.count({ where: { userId, vendorId } });
        return count > 0;
    }
}
