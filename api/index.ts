import { NestFactory } from '@nestjs/core';
import { AppModule } from '../apps/api/src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    
    app.setGlobalPrefix('api');
    app.enableCors();
    
    await app.init();
    cachedApp = expressApp;
  }
  return cachedApp;
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};
