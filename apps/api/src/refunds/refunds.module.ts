import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundRequest } from './entities/refund-request.entity';
import { RefundsService } from './refunds.service';
import { RefundsController } from './refunds.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([RefundRequest]),
        AuthModule,
    ],
    controllers: [RefundsController],
    providers: [RefundsService],
    exports: [RefundsService],
})
export class RefundsModule {}
