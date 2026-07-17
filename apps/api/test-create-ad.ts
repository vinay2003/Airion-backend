import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { VendorsService } from './src/vendors/vendors.service';
import { User } from './src/auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const vendorsService = app.get(VendorsService);
  const userRepo = app.get(getRepositoryToken(User));

  // Get a random user
  const user = await userRepo.findOne({ where: {} });
  if (!user) {
    console.log('No user found');
    process.exit(1);
  }

  console.log('Using User:', user.id);
  try {
    const adData = {
      title: 'Test Ad',
      imageUrl: 'https://example.com/test.jpg',
      budget: '100'
    };
    const ad = await vendorsService.createAd(user.id, adData);
    console.log('Successfully created ad:', ad);
  } catch (error) {
    console.error('Error creating ad:', error);
  }
  process.exit(0);
}
run();
