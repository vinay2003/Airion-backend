import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('advertisement_analytics')
export class AdvertisementAnalytics {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    campaignId: string;

    @Column({ type: 'int', default: 0 })
    impressions: number;

    @Column({ type: 'int', default: 0 })
    clicks: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    ctr: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    revenue: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
