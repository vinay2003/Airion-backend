import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('moderation_logs')
export class ModerationLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'admin_id' })
    admin: User;

    @Column({ name: 'admin_id' })
    adminId: string;

    @Column()
    action: string; // vendor_approved, vendor_rejected, user_banned, content_removed

    @Column({ name: 'target_type' })
    targetType: string; // vendor, user, service, review

    @Column({ name: 'target_id' })
    targetId: string;

    @Column('text', { nullable: true })
    reason: string;

    @Column('text', { nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
