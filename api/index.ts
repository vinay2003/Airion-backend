import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { existsSync } from 'fs';

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

    // CORS configuration - will be overridden by production settings in main.ts
    app.enableCors({
        origin: process.env.NODE_ENV === 'production'
            ? [
                process.env.FRONTEND_URL || 'https://airion.vercel.app',
                process.env.VENDOR_URL || 'https://airion.vercel.app',
                process.env.ADMIN_URL || 'https://airion.vercel.app'
            ]
            : true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global prefix for all API routes
    app.setGlobalPrefix('api');

    await app.init();

    // ============================================
    // STATIC FILE SERVING FOR PRODUCTION SPA
    // ============================================

    const distPath = path.join(__dirname, '..', 'dist');

    // Serve static files from dist folder
    expressApp.use(express.static(distPath, {
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, filepath) => {
            // Cache JS/CSS/assets aggressively
            if (filepath.match(/\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico)$/)) {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
            // Don't cache HTML files
            if (filepath.endsWith('.html')) {
                res.setHeader('Cache-Control', 'no-cache, must-revalidate');
            }
        }
    }));

    // Serve vendor dashboard static files
    expressApp.use('/vendor', express.static(path.join(distPath, 'vendor'), {
        maxAge: '1y',
        immutable: true,
    }));

    // Serve admin panel static files
    expressApp.use('/admin', express.static(path.join(distPath, 'admin'), {
        maxAge: '1y',
        immutable: true,
    }));

    // ============================================
    // SPA FALLBACK ROUTES (React Router Support)
    // ============================================

    // Vendor dashboard - catch-all for React Router
    expressApp.get('/vendor/*', (req, res) => {
        const vendorIndexPath = path.join(distPath, 'vendor', 'index.html');
        if (existsSync(vendorIndexPath)) {
            res.sendFile(vendorIndexPath);
        } else {
            res.status(404).send('Vendor dashboard not found. Please build the frontend.');
        }
    });

    // Admin panel - catch-all for React Router
    expressApp.get('/admin/*', (req, res) => {
        const adminIndexPath = path.join(distPath, 'admin', 'index.html');
        if (existsSync(adminIndexPath)) {
            res.sendFile(adminIndexPath);
        } else {
            res.status(404).send('Admin panel not found. Please build the frontend.');
        }
    });

    // Main website - catch-all for React Router (must be last)
    expressApp.get('*', (req, res) => {
        // Don't serve index.html for API routes
        if (req.path.startsWith('/api')) {
            return res.status(404).json({
                statusCode: 404,
                message: 'API endpoint not found',
                path: req.path
            });
        }

        const mainIndexPath = path.join(distPath, 'index.html');
        if (existsSync(mainIndexPath)) {
            res.sendFile(mainIndexPath);
        } else {
            res.status(404).send('Application not found. Please build the frontend.');
        }
    });

    cachedApp = expressApp;
    return cachedApp;
}

export default async (req: any, res: any) => {
    const app = await createNestApp();
    app(req, res);
};
