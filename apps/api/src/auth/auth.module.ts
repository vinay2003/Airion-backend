import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Otp } from './entities/otp.entity';
import { Session } from './entities/session.entity';
import { AuditLog } from './entities/audit-log.entity';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { AuditService } from './services/audit.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Vendor } from '../vendors/entities/vendor.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Otp, Session, AuditLog, Vendor]),
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
    controllers: [AuthController],
    providers: [AuthService, SessionService, AuditService, JwtStrategy],
    exports: [AuthService, SessionService, AuditService],
})
export class AuthModule { }
