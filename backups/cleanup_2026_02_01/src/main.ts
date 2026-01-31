import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

const logger = new Logger('Bootstrap');

// Environment validation
function validateEnvironment() {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    logger.error('❌ Missing required environment variables:');
    missing.forEach(varName => logger.error(`   - ${varName}`));
    logger.error('\n💡 Create a .env file in the project root with these variables.');
    logger.error('   See .env.example or documentation for details.\n');
    process.exit(1);
  }

  logger.log('✅ Environment variables validated');
}

async function bootstrap() {
  // Validate environment before creating app
  validateEnvironment();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get configuration values
  const nodeEnv = configService.get<string>('app.nodeEnv');
  const frontendUrl = configService.get<string>('app.frontendUrl');
  const vendorUrl = configService.get<string>('app.vendorUrl');
  const adminUrl = configService.get<string>('app.adminUrl');

  // Middleware
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS configuration - production-ready
  const corsOrigins = nodeEnv === 'production'
    ? [frontendUrl, vendorUrl, adminUrl].filter((url): url is string => !!url)
    : true; // Allow all in development

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  if (nodeEnv === 'production') {
    logger.log(`🔒 CORS restricted to: ${corsOrigins}`);
  } else {
    logger.warn('⚠️  CORS allowing all origins (development mode)');
  }

  const port = configService.get<number>('app.port') ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
  logger.log(`📊 Health check: http://localhost:${port}/health`);
  logger.log(`🔐 Auth endpoint: http://localhost:${port}/auth/*`);
}

bootstrap().catch(err => {
  logger.error('❌ Application failed to start:', err);
  process.exit(1);
});
