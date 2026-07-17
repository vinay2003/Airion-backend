import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from './entities/dispute.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { Vendor } from '../vendors/entities/vendor.entity';
import { User } from '../auth/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Category } from '../categories/entities/category.entity';
import { Location } from '../categories/entities/location.entity';
import { SupportTicket } from './entities/support-ticket.entity';
import { Ad } from '../ads/entities/ad.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { AuditLog } from '../auth/entities/audit-log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Dispute, Vendor, User, Booking, Category, Location, SupportTicket, Ad, Coupon, AuditLog])],
    providers: [AdminService],
    controllers: [AdminController],
    exports: [AdminService],
})
export class AdminModule {}
