import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from './entities/dispute.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { Vendor } from '../vendors/entities/vendor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Dispute, Vendor])],
    providers: [AdminService],
    controllers: [AdminController],
    exports: [AdminService],
})
export class AdminModule {}
