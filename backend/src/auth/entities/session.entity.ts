import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'token_hash', type: 'varchar', length: 255 })
    tokenHash: string;

    @Column({ name: 'ip_address', type: 'varchar', length: 45 })
    ipAddress: string;

    @Column({ name: 'user_agent', type: 'text' })
    userAgent: string;

    @Column({ name: 'device_name', type: 'varchar', length: 255, nullable: true })
    deviceName?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'expires_at', type: 'timestamp' })
    expiresAt: Date;

    @Column({ name: 'last_used_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastUsedAt: Date;

    @Column({ name: 'revoked_at', type: 'timestamp', nullable: true })
    revokedAt?: Date;
}
