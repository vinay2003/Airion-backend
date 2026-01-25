import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { DataSource } from 'typeorm';
import { User } from './auth/entities/user.entity';
import { Role } from './common/enums/role.enum';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const userRepository = dataSource.getRepository(User);

    const email = 'admin@airion.com';
    const phone = '9999999999';
    const password = 'admin'; // Simple password for dev

    const existingAdmin = await userRepository.findOneBy({ email });
    if (existingAdmin) {
        console.log('Admin already exists');
    } else {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = userRepository.create({
            name: 'Super Admin',
            email,
            phone,
            password: hashedPassword,
            role: Role.ADMIN,
            isVerified: true,
        });

        await userRepository.save(admin);
        console.log('Admin user created successfully');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    }

    await app.close();
}

bootstrap();
