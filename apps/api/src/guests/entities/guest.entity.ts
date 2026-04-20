import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum RSVPStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    DECLINED = 'declined',
}

@Entity('guests')
export class Guest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: 'Uncategorized' })
    group: string;

    @Column({
        type: 'enum',
        enum: RSVPStatus,
        default: RSVPStatus.PENDING,
    })
    rsvpStatus: RSVPStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
