import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { NotificationsModule } from '../notifications/notifications.module';

import { WalletModule } from '../wallet/wallet.module';
import { AvailabilityModule } from '../availability/availability.module';
import { AuthModule } from '../auth/auth.module';

import { EmailService } from '../common/services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    NotificationsModule,
    WalletModule,
    AvailabilityModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService, EmailService],
  exports: [BookingsService],
})
export class BookingsModule { }
