import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';

@Entity('wallets')
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Vendor)
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;

    @Column({ name: 'vendor_id' })
    vendorId: string;

    @Column('decimal', { name: 'current_balance', precision: 12, scale: 2, default: 0 })
    currentBalance: number;

    @Column('decimal', { name: 'pending_balance', precision: 12, scale: 2, default: 0 })
    pendingBalance: number;

    @Column('decimal', { name: 'total_withdrawn', precision: 12, scale: 2, default: 0 })
    totalWithdrawn: number;

    @Column({ default: 'INR' })
    currency: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => WalletTransaction, (transaction) => transaction.wallet)
    transactions: WalletTransaction[];
}

@Entity('wallet_transactions')
export class WalletTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    @JoinColumn({ name: 'wallet_id' })
    wallet: Wallet;

    @Column({ name: 'wallet_id' })
    walletId: string;

    @Column({ type: 'enum', enum: ['EARNING', 'WITHDRAWAL', 'REFUND', 'AD_PAYMENT', 'PLATFORM_FEE'] })
    type: 'EARNING' | 'WITHDRAWAL' | 'REFUND' | 'AD_PAYMENT' | 'PLATFORM_FEE';

    @Column('decimal', { precision: 12, scale: 2 })
    amount: number;

    @Column({ default: 'pending' })
    status: 'pending' | 'completed' | 'failed' | 'cancelled';

    @Column({ name: 'reference_id', nullable: true })
    referenceId: string; // Booking ID or Withdrawal Request ID

    @Column('text', { nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
