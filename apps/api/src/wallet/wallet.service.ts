import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet, WalletTransaction } from './entities/wallet.entity';
import { PayoutRequest } from './entities/payout-request.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletRepository: Repository<Wallet>,
        @InjectRepository(WalletTransaction)
        private readonly transactionRepository: Repository<WalletTransaction>,
        @InjectRepository(PayoutRequest)
        private readonly payoutRepository: Repository<PayoutRequest>,
    ) {}

    async getOrCreateWallet(vendorId: string): Promise<Wallet> {
        let wallet = await this.walletRepository.findOne({ where: { vendorId } });
        
        if (!wallet) {
            wallet = this.walletRepository.create({
                vendorId,
                currentBalance: 0,
                pendingBalance: 0,
                totalWithdrawn: 0,
                currency: 'INR',
            });
            await this.walletRepository.save(wallet);
        }
        
        return wallet;
    }

    async getWalletOverview(vendorId: string) {
        const wallet = await this.getOrCreateWallet(vendorId);
        const recentTransactions = await this.transactionRepository.find({
            where: { walletId: wallet.id },
            order: { createdAt: 'DESC' },
            take: 10,
        });

        return {
            balance: wallet.currentBalance,
            pending: wallet.pendingBalance,
            totalWithdrawn: wallet.totalWithdrawn,
            currency: wallet.currency,
            transactions: recentTransactions,
        };
    }

    /**
     * Credit earnings to a vendor's wallet from a booking.
     * Usually moves to 'pending' first until event is completed.
     */
    async creditEarning(vendorId: string, amount: number, bookingId: string, description: string) {
        const wallet = await this.getOrCreateWallet(vendorId);
        
        // Strategy: Add to current balance (simplification for this step)
        // In full production, we'd add to pendingBalance first.
        wallet.currentBalance = Number(wallet.currentBalance) + Number(amount);
        await this.walletRepository.save(wallet);

        const transaction = this.transactionRepository.create({
            walletId: wallet.id,
            type: 'EARNING',
            amount,
            status: 'completed',
            referenceId: bookingId,
            description,
        });
        
        return this.transactionRepository.save(transaction);
    }

    async requestWithdrawal(vendorId: string, amount: number, bankDetails?: any) {
        const wallet = await this.getOrCreateWallet(vendorId);
        
        if (Number(wallet.currentBalance) < Number(amount)) {
            throw new BadRequestException('Insufficient balance for withdrawal');
        }

        // 1. Create Transaction (Type: WITHDRAWAL, Status: pending)
        const transaction = this.transactionRepository.create({
            walletId: wallet.id,
            type: 'WITHDRAWAL',
            amount,
            status: 'pending',
            description: 'Payout request initiated',
        });
        const savedTx = await this.transactionRepository.save(transaction);

        // 2. Create Payout Request
        const payout = this.payoutRepository.create({
            walletId: wallet.id,
            amount,
            status: 'pending',
            bankDetails: bankDetails || {},
        });
        const savedPayout = await this.payoutRepository.save(payout);

        // 3. Move balance to 'pending_balance' instead of just deducting
        wallet.currentBalance = Number(wallet.currentBalance) - Number(amount);
        wallet.pendingBalance = Number(wallet.pendingBalance) + Number(amount);
        await this.walletRepository.save(wallet);

        return { success: true, payoutId: savedPayout.id, transactionId: savedTx.id };
    }

    async getPayoutHistory(vendorId: string) {
        const wallet = await this.getOrCreateWallet(vendorId);
        return this.payoutRepository.find({
            where: { walletId: wallet.id },
            order: { createdAt: 'DESC' },
        });
    }
}
