import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';

export enum CartItemType {
    BOOKING = 'BOOKING',
    MERCHANDISE = 'MERCHANDISE'
}

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    cartId: string;

    @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cartId' })
    cart: Cart;

    @Column({ type: 'enum', enum: CartItemType })
    itemType: CartItemType;

    @Column({ type: 'uuid' })
    referenceId: string; // ID of the Service Package or Shop Product

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any; // E.g., event date, selected variation, add-ons

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
