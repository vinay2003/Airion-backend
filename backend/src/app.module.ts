import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { VendorsModule } from './vendors/vendors.module';
import { CategoriesModule } from './categories/categories.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LeadsModule } from './leads/leads.module';
import { AdsModule } from './ads/ads.module';
import { CouponsModule } from './coupons/coupons.module';
import { WishlistsModule } from './wishlists/wishlists.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 10,
        }]),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('DATABASE_URL'),
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT', 5432),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                ssl: configService.get<string>('DATABASE_URL') ? { rejectUnauthorized: false } : false,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: configService.get<string>('NODE_ENV') !== 'production', // Only sync in non-production
                logging: configService.get<string>('NODE_ENV') === 'development' ? ['error', 'warn'] : false,
            }),
        }),
        AuthModule,
        VendorsModule,
        CategoriesModule,
        ServicesModule,
        BookingsModule,
        ReviewsModule,
        PaymentsModule,
        NotificationsModule,
        LeadsModule,
        AdsModule,
        CouponsModule,
        WishlistsModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
