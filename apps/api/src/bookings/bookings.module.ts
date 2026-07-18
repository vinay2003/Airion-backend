import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

import { WalletModule } from '../wallet/wallet.module';
import { AvailabilityModule } from '../availability/availability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]), 
    NotificationsModule, 
    WalletModule, 
    AvailabilityModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
