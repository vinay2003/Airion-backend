import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column()
    type: string; // 'percentage' | 'fixed'

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ type: 'int', default: 0 })
    usageLimit: number;

    @Column({ type: 'int', default: 0 })
    usedCount: number;

    @Column({ type: 'timestamp' })
    expiryDate: Date;

    @Column({ default: 'Active' })
    status: string; // 'Active' | 'Expired' | 'Depleted'

    @Column({ default: 'All' })
    applicableTo: string; // 'All' | 'Venue' | 'Photography' | 'Makeup Artist'

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
