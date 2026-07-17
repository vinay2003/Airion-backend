import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RefundStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    PROCESSED = 'processed',
}

@Entity('refund_requests')
export class RefundRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    bookingId: string;

    @Column()
    userId: string;

    @Column('decimal', { precision: 10, scale: 2 })
    bookingAmount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    refundAmount: number;

    @Column({ type: 'enum', enum: RefundStatus, default: RefundStatus.PENDING })
    status: RefundStatus;

    @Column({ nullable: true })
    reason: string;

    // Bank transfer details (stored encrypted in production)
    @Column({ nullable: true })
    bankName: string;

    @Column({ nullable: true })
    accountNumber: string;

    @Column({ nullable: true })
    ifscCode: string;

    @Column({ nullable: true })
    adminNote: string;

    @Column({ nullable: true })
    processedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
