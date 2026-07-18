import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id', type: 'uuid' })
    orderId: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ name: 'fulfillment_status', type: 'varchar', length: 50, default: 'PENDING' })
    fulfillmentStatus: string;

    @Column({ name: 'tracking_number', type: 'varchar', length: 100, nullable: true })
    trackingNumber: string;

    @Column({ name: 'courier_name', type: 'varchar', length: 100, nullable: true })
    courierName: string;

    @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
    shippedAt: Date;

    @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
    deliveredAt: Date;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
