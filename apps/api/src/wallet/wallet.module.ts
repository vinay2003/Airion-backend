import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet, WalletTransaction } from './entities/wallet.entity';
import { PayoutRequest } from './entities/payout-request.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Wallet, WalletTransaction, PayoutRequest]),
        VendorsModule,
    ],
    providers: [WalletService],
    controllers: [WalletController],
    exports: [WalletService],
})
export class WalletModule {}
