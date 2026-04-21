import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { Vendor } from './entities/vendor.entity';
import { Activity } from './entities/activity.entity';
import { Category } from '../categories/entities/category.entity';
import { Subcategory } from '../categories/entities/subcategory.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { VendorAd } from './entities/vendor-ad.entity';
import { VendorGallery } from './entities/vendor-gallery.entity';
import { Availability } from '../availability/entities/availability.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, Activity, Category, Subcategory, Booking, VendorAd, VendorGallery, Availability]),
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule { }
