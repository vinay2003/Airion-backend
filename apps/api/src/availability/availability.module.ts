import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './entities/availability.entity';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { VendorsModule } from '../vendors/vendors.module';
import { Vendor } from '../vendors/entities/vendor.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Availability, Vendor]),
        VendorsModule,
    ],
    providers: [AvailabilityService],
    controllers: [AvailabilityController],
    exports: [AvailabilityService],
})
export class AvailabilityModule {}
