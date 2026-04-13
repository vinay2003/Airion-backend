import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { TransformInterceptor } from './infrastructure/interceptors/transform.interceptor';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

import { setDefaultResultOrder } from 'dns';
import helmet from 'helmet';

async function bootstrap() {
    // Force IPv4-first DNS resolution order to fix "Happy Eyeballs" AggregateErrors on macOS with NeonDB
    setDefaultResultOrder('ipv4first');

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
                        : nestWinstonModuleUtilities.format.nestLike('Ease2event', { colors: true, prettyPrint: true }),
                ),
            }),
        ],
    });

    const app = await NestFactory.create(AppModule, { logger });

    // Security Headers & Performance
    app.use(helmet());
    const compression = require('compression');
    app.use(compression());

    // Enable CORS with dynamic absolute origin
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                'https://ease2event.vercel.app',
                'https://vendor.ease2event.vercel.app',
                'https://admin.ease2event.vercel.app'
            ];
            const isLocal = !origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
            if (isLocal || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
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
    app.useGlobalPipes(new ZodValidationPipe());

    // Global prefix for all routes
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Backend server is running on http://0.0.0.0:${port}`);
    console.log(`📡 Local access: http://localhost:${port}`);
}

bootstrap();
