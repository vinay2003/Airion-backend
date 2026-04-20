import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity('payout_requests')
export class PayoutRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Wallet)
    @JoinColumn({ name: 'wallet_id' })
    wallet: Wallet;

    @Column({ name: 'wallet_id' })
    walletId: string;

    @Column('decimal', { precision: 12, scale: 2 })
    amount: number;

    @Column({ default: 'pending' }) // pending, approved, rejected, processing, completed
    status: string;

    @Column({ name: 'admin_notes', nullable: true })
    adminNotes: string;

    @Column('jsonb', { name: 'bank_details', nullable: true })
    bankDetails: {
        accountNumber: string;
        ifscCode: string;
        accountHolderName: string;
        bankName: string;
    };

    @Column({ name: 'processed_at', nullable: true })
    processedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
