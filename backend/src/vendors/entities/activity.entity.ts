import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum ActivityType {
    PROFILE_VIEW = 'profile_view',
    CATEGORY_VIEW = 'category_view',
    SAVE_BOOKMARK = 'save_bookmark',
}

@Entity('activities')
export class Activity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({
        type: 'enum',
        enum: ActivityType,
    })
    type: ActivityType;

    @Column({ name: 'target_id', nullable: true })
    targetId: string; // Vendor ID, Category ID, etc.

    @Column('jsonb', { nullable: true })
    metadata: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
