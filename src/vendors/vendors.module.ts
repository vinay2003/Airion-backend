import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './controllers/vendors.controller';
import { VendorsService } from './services/vendors.service';
import { Vendor } from './entities/vendor.entity';
import { User } from '../auth/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vendor, User]),
        AuthModule,
    ],
    controllers: [VendorsController],
    providers: [VendorsService],
    exports: [VendorsService],
})
export class VendorsModule { }
