import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { AuditLog } from './entities/audit-log.entity';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { AuditService } from './services/audit.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Session, AuditLog]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            signOptions: { expiresIn: '7d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, SessionService, AuditService, JwtStrategy],
    exports: [AuthService, SessionService, AuditService],
})
export class AuthModule { }
