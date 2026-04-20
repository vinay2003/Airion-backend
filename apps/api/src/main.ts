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
                'https://airion-backend-admin-panel-1e98o3h6f-vinay2003s-projects.vercel.app',
                'https://airion-backend-vendor-dashboard.vercel.app',
                'https://airion-backend-admin-panel-eg56.vercel.app',
                process.env.FRONTEND_URL,
                process.env.VENDOR_URL,
                process.env.ADMIN_URL,
            ].filter(Boolean) as string[];

            const isLocal = !origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
            const isVercel = origin && origin.endsWith('.vercel.app');

            if (isLocal || isVercel || allowedOrigins.includes(origin as string)) {
                callback(null, true);
            } else {
                console.warn(`🔒 CORS Blocked for origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    // Global Filters & Interceptors
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

    // Global validation pipe
    app.useGlobalPipes(new ZodValidationPipe());

    // --- PRODUCTION STABILITY: GRACEFUL SHUTDOWN ---
    app.enableShutdownHooks();

    // Global prefix for all routes
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Backend server is running on http://0.0.0.0:${port}`);
    console.log(`📡 Local access: http://localhost:${port}`);
}

bootstrap();
