import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { ServicePackage } from './entities/service-package.entity';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServicePackage]), VendorsModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService], // useful for other modules
})
export class ServicesModule {}
