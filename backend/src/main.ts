import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
        credentials: true,
    });

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
