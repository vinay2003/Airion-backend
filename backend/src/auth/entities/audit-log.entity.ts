import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid', nullable: true })
    userId?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @Column({ type: 'varchar', length: 100 })
    action: string;

    @Column({ name: 'resource_type', type: 'varchar', length: 50, nullable: true })
    resourceType?: string;

    @Column({ name: 'resource_id', type: 'varchar', length: 255, nullable: true })
    resourceId?: string;

    @Column({ name: 'ip_address', type: 'varchar', length: 45 })
    ipAddress: string;

    @Column({ name: 'user_agent', type: 'text' })
    userAgent: string;

    @Column({ type: 'boolean', default: true })
    success: boolean;

    @Column({ name: 'failure_reason', type: 'varchar', length: 255, nullable: true })
    failureReason?: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
