import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import cookieParser from 'cookie-parser';

const expressApp = express();
let cachedApp: any;

async function createNestApp() {
    if (cachedApp) {
        return cachedApp;
    }

    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);

    // Middleware
    app.use(cookieParser());

    // CORS configuration for same-origin
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global prefix for all routes
    app.setGlobalPrefix('api');

    await app.init();

    cachedApp = expressApp;
    return cachedApp;
}

export default async (req: any, res: any) => {
    const app = await createNestApp();
    app(req, res);
};
