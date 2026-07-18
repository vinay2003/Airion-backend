import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AdStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum AdType {
  FEATURED = 'featured',
  BANNER = 'banner',
  CATEGORY = 'category',
  CITY = 'city',
  EVENT = 'event',
}

@Entity('advertisements')
export class Ad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  vendorId: string;

  @Column()
  campaignName: string;

  @Column({ type: 'enum', enum: AdType, default: AdType.BANNER })
  adType: AdType;

  // Target audience criteria (e.g. { city: 'Delhi', categoryId: '...', eventType: 'wedding' })
  @Column({ type: 'jsonb', nullable: true })
  targetAudience: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  dailyBudget: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalBudget: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  // List of banner image URLs or video links
  @Column({ type: 'jsonb', nullable: true })
  mediaUrls: string[];

  @Column({ type: 'enum', enum: AdStatus, default: AdStatus.PENDING })
  status: AdStatus;

  @Column({ type: 'int', default: 0 })
  impressions: number;

  @Column({ type: 'int', default: 0 })
  clicks: number;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
