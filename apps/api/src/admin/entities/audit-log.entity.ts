import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    @Index()
    adminId: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'adminId' })
    admin: User;

    @Column({ type: 'varchar', length: 100 })
    @Index()
    action: string;

    @Column({ type: 'varchar', length: 100 })
    @Index()
    resource: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    resourceId?: string;

    @Column({ type: 'jsonb', nullable: true })
    previousValue?: any;

    @Column({ type: 'jsonb', nullable: true })
    newValue?: any;

    @Column({ type: 'varchar', length: 255, nullable: true })
    ipAddress?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    userAgent?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    requestId?: string;

    @CreateDateColumn({ name: 'created_at' })
    @Index()
    createdAt: Date;
}
