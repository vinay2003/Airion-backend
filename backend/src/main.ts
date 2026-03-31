import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { TransformInterceptor } from './infrastructure/interceptors/transform.interceptor';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

import helmet from 'helmet';

async function bootstrap() {
    // Determine JSON vs Pretty logging based on environment
    const isProduction = process.env.NODE_ENV === 'production';

    const logger = WinstonModule.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.ms(),
                    isProduction
                        ? winston.format.json()
                        : nestWinstonModuleUtilities.format.nestLike('Airion', { colors: true, prettyPrint: true }),
                ),
            }),
        ],
    });

    const app = await NestFactory.create(AppModule, { logger });

    // Security Headers
    app.use(helmet());

    // Enable CORS with dynamic origin
    app.enableCors({
        origin: (origin, callback) => {
            const isLocal = !origin || origin.startsWith('http://localhost:');
            if (isLocal || process.env.NODE_ENV !== 'production' ||
                [
                    'https://airion.vercel.app',
                    'https://admin.airion.vercel.app'
                ].indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        maxAge: 86400, // 24 hours preflight cache
    });

    // Global Filters & Interceptors
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // Global prefix for all routes
    app.setGlobalPrefix('api');

    await app.listen(3000);
    console.log('🚀 Backend server is running on http://localhost:3000');
}

bootstrap();
