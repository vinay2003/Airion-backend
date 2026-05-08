import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { User } from '../../auth/entities/user.entity';

export enum SubscriptionStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
    PAST_DUE = 'past_due',
}

@Entity('active_subscriptions')
export class ActiveSubscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid' })
    userId: string; // The user or vendor who owns the subscription

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'uuid' })
    planId: string;

    @ManyToOne(() => SubscriptionPlan)
    @JoinColumn({ name: 'planId' })
    plan: SubscriptionPlan;

    @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
    status: SubscriptionStatus;

    @Column({ type: 'timestamp' })
    currentPeriodStart: Date;

    @Column({ type: 'timestamp' })
    currentPeriodEnd: Date;

    @Column({ type: 'boolean', default: true })
    autoRenew: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    stripeSubscriptionId: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    stripeCustomerId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
