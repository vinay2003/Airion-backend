import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Vendor } from './vendor.entity';

export enum AdStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    PAUSED = 'paused',
    REJECTED = 'rejected',
    COMPLETED = 'completed'
}

@Entity('vendor_ads')
export class VendorAd {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vendor, vendor => vendor.ads, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendor_id', foreignKeyConstraintName: 'fk_vendor_ads_vendor' })
    vendor: Vendor;

    @Column('varchar', { length: 255 })
    title: string;

    @Column('text')
    imageUrl: string;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    budget: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    spent: number;

    @Column({
        type: 'enum',
        enum: AdStatus,
        default: AdStatus.PENDING
    })
    status: AdStatus;

    @Column('timestamp', { name: 'start_at', nullable: true })
    startAt: Date;

    @Column('timestamp', { name: 'end_at', nullable: true })
    endAt: Date;

    @Column('int', { default: 0 })
    impressions: number;

    @Column('int', { default: 0 })
    clicks: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
