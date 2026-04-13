import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Index()
    @Column({ name: 'user_id' })
    userId: string;

    @Column('varchar', { length: 255 })
    @Index({ unique: true })
    tokenHash: string;

    @Column('timestamp')
    expiresAt: Date;

    @Column('boolean', { default: false })
    isRevoked: boolean;

    @Column('varchar', { nullable: true })
    deviceInfo: string;

    @Column('varchar', { nullable: true })
    ipAddress: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
