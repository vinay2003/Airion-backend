import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class MerchandiseService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) {}

    async findAll(options?: { adminMode?: boolean; vendorId?: string }): Promise<Product[]> {
        const query = this.productRepository.createQueryBuilder('product');
        
        if (options?.adminMode) {
            // Admin sees all
        } else if (options?.vendorId) {
            // Vendor sees their own (all statuses)
            query.where('product.creatorId = :vendorId', { vendorId: options.vendorId });
        } else {
            // Public shop sees only active & approved
            query.where('product.isActive = :isActive', { isActive: true })
                 .andWhere('product.approvalStatus = :status', { status: 'approved' });
        }
        
        return query.orderBy('product.createdAt', 'DESC').getMany();
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async create(productData: Partial<Product>, creatorId: string, creatorRole: string): Promise<Product> {
        const product = this.productRepository.create({
            ...productData,
            creatorId,
            creatorRole,
            // Admins are auto-approved, vendors are pending by default
            approvalStatus: creatorRole === 'admin' ? 'approved' : 'pending',
        });
        return this.productRepository.save(product);
    }

    async update(id: string, productData: Partial<Product>, creatorId: string, creatorRole: string): Promise<Product> {
        const product = await this.findOne(id);

        // Security check: Only Admins or the owning Vendor can update
        if (creatorRole === 'vendor' && product.creatorId !== creatorId) {
            throw new ForbiddenException('You are not authorized to update this product');
        }

        Object.assign(product, productData);
        // If a vendor updates, reset approval to pending unless it's just stock
        if (creatorRole === 'vendor') {
            product.approvalStatus = 'pending';
        }
        return this.productRepository.save(product);
    }

    async updateApprovalStatus(id: string, status: 'approved' | 'rejected'): Promise<Product> {
        const product = await this.findOne(id);
        product.approvalStatus = status;
        return this.productRepository.save(product);
    }

    async delete(id: string, creatorId: string, creatorRole: string): Promise<{ success: boolean }> {
        const product = await this.findOne(id);

        // Security check: Only Admins or the owning Vendor can delete
        if (creatorRole === 'vendor' && product.creatorId !== creatorId) {
            throw new ForbiddenException('You are not authorized to delete this product');
        }

        await this.productRepository.remove(product);
        return { success: true };
    }

    async checkout(
        userId: string,
        orderData: {
            items: { productId: string; quantity: number }[];
            shippingAddress: string;
            phone: string;
            paymentMethod: string;
        },
    ): Promise<Order> {
        const { items, shippingAddress, phone, paymentMethod } = orderData;

        if (!items || items.length === 0) {
            throw new BadRequestException('No items in the order');
        }

        let totalAmount = 0;
        const resolvedItems: { product: Product; quantity: number; price: number }[] = [];

        // Validate stock and calculate total
        for (const item of items) {
            const product = await this.findOne(item.productId);
            if (product.stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for product: ${product.title}`);
            }
            totalAmount += Number(product.price) * item.quantity;
            resolvedItems.push({
                product,
                quantity: item.quantity,
                price: Number(product.price),
            });
        }

        // Save Order
        const order = this.orderRepository.create({
            userId,
            totalAmount,
            shippingAddress,
            phone,
            paymentMethod,
            status: 'processing',
        });
        const savedOrder = await this.orderRepository.save(order);

        // Save Order Items and deplete stock
        const orderItems: OrderItem[] = [];
        for (const resolved of resolvedItems) {
            const orderItem = this.orderItemRepository.create({
                orderId: savedOrder.id,
                productId: resolved.product.id,
                quantity: resolved.quantity,
                price: resolved.price,
            });
            orderItems.push(orderItem);

            // Deplete stock
            resolved.product.stock -= resolved.quantity;
            await this.productRepository.save(resolved.product);
        }
        await this.orderItemRepository.save(orderItems);

        savedOrder.items = orderItems;
        return savedOrder;
    }

    async getOrders(userId: string): Promise<Order[]> {
        return this.orderRepository.find({
            where: { userId },
            relations: ['items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }
}
