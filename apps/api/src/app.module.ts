import { join } from 'path';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
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
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';
import { CorrelationMiddleware } from './infrastructure/middleware/correlation.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                join(__dirname, '..', '..', '.env'),      // apps/api/.env (if running from api root)
                join(__dirname, '..', '..', '..', '.env'), // apps/.env (if running from apps root)
                join(__dirname, '..', '..', '..', '..', '.env'), // (ROOT)/.env (if running from root)
                '.env'                                    // Local .env
            ],
        }),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 10,
        }]),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const url = configService.get<string>('DATABASE_URL');
                const isProd = configService.get<string>('NODE_ENV') === 'production';
                
                return {
                    type: 'postgres',
                    url,
                    ssl: { 
                        rejectUnauthorized: false,
                    },
                    extra: {
                        family: 4,
                    },
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    autoLoadEntities: true,
                    synchronize: !isProd,
                    logging: !isProd ? ['error', 'warn'] : false,
                    retryAttempts: 10,
                    retryDelay: 3000,
                };
            },
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
        UserDashboardModule,
    ],
    controllers: [AppController],
})
export class AppModule implements NestModule { 
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CorrelationMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
