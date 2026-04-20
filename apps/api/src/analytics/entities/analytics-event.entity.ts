import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('analytics_events')
export class AnalyticsEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    @Index()
    type: 'profile_view' | 'service_click' | 'booking_start' | 'search_hit';

    @Column({ name: 'target_id', nullable: true })
    @Index()
    targetId: string; // Vendor ID or Service ID

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', nullable: true })
    userId: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any; // Browser info, device, location, search query

    @CreateDateColumn({ name: 'created_at' })
    @Index()
    createdAt: Date;
}
