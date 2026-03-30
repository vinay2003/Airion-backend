import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('leads')
export class Lead {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Vendor)
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;

    @Index()
    @Column({ name: 'vendor_id' })
    vendorId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Index()
    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => Service, { nullable: true })
    @JoinColumn({ name: 'service_id' })
    service?: Service;

    @Column({ name: 'service_id', nullable: true })
    serviceId?: string;

    @Column('timestamp', { name: 'event_date' })
    eventDate: Date;

    @Column('int', { name: 'guests_count', nullable: true })
    guestsCount: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    budget: number;

    @Column('text', { nullable: true })
    notes: string;

    @Column({ default: 'pending' })
    status: string; // pending, contacted, won, lost

    @Column('int', { name: 'ai_score', default: 0 })
    aiScore: number; // 1-100

    @Column('text', { name: 'ai_reasoning', nullable: true })
    aiReasoning: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
