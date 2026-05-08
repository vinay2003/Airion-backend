import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SubscriptionType {
    USER = 'user',
    VENDOR = 'vendor',
}

export enum BillingCycle {
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
}

@Entity('subscription_plans')
export class SubscriptionPlan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: SubscriptionType })
    type: SubscriptionType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'enum', enum: BillingCycle })
    billingCycle: BillingCycle;

    @Column({ type: 'jsonb', default: [] })
    features: string[];

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'int', default: 0 })
    priority: number; // For sorting plans on the frontend

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
