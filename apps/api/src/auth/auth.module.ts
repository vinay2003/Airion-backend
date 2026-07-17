import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Otp } from './entities/otp.entity';
import { Session } from './entities/session.entity';
import { AuditLog } from './entities/audit-log.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { AuditService } from './services/audit.service';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorAd } from '../vendors/entities/vendor-ad.entity';
import { VendorGallery } from '../vendors/entities/vendor-gallery.entity';
import { Category } from '../categories/entities/category.entity';
import { Subcategory } from '../categories/entities/subcategory.entity';
import { EmailService } from '../common/services/email.service';
import { SmsService } from '../common/services/sms.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Otp, Session, AuditLog, Vendor, RefreshToken, VendorAd, VendorGallery, Category, Subcategory]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '7d' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController, UsersController],
    providers: [AuthService, SessionService, AuditService, JwtStrategy, EmailService, SmsService],
    exports: [AuthService, SessionService, AuditService, JwtModule, EmailService, SmsService],
})
export class AuthModule { }
