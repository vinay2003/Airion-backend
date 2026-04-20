import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './entities/availability.entity';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Availability]),
        VendorsModule,
    ],
    providers: [AvailabilityService],
    controllers: [AvailabilityController],
    exports: [AvailabilityService],
})
export class AvailabilityModule {}
