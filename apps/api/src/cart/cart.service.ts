import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem, CartItemType } from './entities/cart-item.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
    ) {}

    async getCart(userId: string): Promise<Cart> {
        let cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items'],
        });

        if (!cart) {
            cart = this.cartRepository.create({ userId });
            await this.cartRepository.save(cart);
            cart.items = [];
        }

        return cart;
    }

    async addItem(userId: string, dto: { itemType: CartItemType; referenceId: string; quantity?: number; metadata?: any }) {
        const cart = await this.getCart(userId);

        // Check if item already exists
        let existingItem = cart.items.find(
            item => item.itemType === dto.itemType && item.referenceId === dto.referenceId
        );

        // If the item has metadata (like a different date for a booking), we might want to treat it as a separate item,
        // but for simplicity, let's just check itemType and referenceId.
        if (existingItem) {
            existingItem.quantity += dto.quantity || 1;
            if (dto.metadata) {
                existingItem.metadata = { ...existingItem.metadata, ...dto.metadata };
            }
            await this.cartItemRepository.save(existingItem);
        } else {
            const newItem = this.cartItemRepository.create({
                cartId: cart.id,
                itemType: dto.itemType,
                referenceId: dto.referenceId,
                quantity: dto.quantity || 1,
                metadata: dto.metadata || null,
            });
            await this.cartItemRepository.save(newItem);
        }

        return this.getCart(userId);
    }

    async updateItemQuantity(userId: string, itemId: string, quantity: number) {
        const cart = await this.getCart(userId);
        const item = cart.items.find(i => i.id === itemId);

        if (!item) {
            throw new NotFoundException('Item not found in cart');
        }

        if (quantity <= 0) {
            return this.removeItem(userId, itemId);
        }

        item.quantity = quantity;
        await this.cartItemRepository.save(item);

        return this.getCart(userId);
    }

    async removeItem(userId: string, itemId: string) {
        const cart = await this.getCart(userId);
        const item = cart.items.find(i => i.id === itemId);

        if (item) {
            await this.cartItemRepository.remove(item);
        }

        return this.getCart(userId);
    }

    async clearCart(userId: string) {
        const cart = await this.getCart(userId);
        if (cart.items.length > 0) {
            await this.cartItemRepository.remove(cart.items);
        }
        return this.getCart(userId);
    }

    async mergeCart(userId: string, items: { itemType: CartItemType; referenceId: string; quantity: number; metadata: any }[]) {
        if (!items || items.length === 0) return this.getCart(userId);

        for (const item of items) {
            await this.addItem(userId, item);
        }

        return this.getCart(userId);
    }
}
