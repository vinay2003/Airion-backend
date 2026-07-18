import { DataSource } from 'typeorm';
import { Otp } from './apps/api/src/auth/entities/otp.entity';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_UHIlwOxX0a2T@ep-aged-frost-aif42cf4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require",
    entities: [Otp],
    synchronize: false,
});

async function run() {
    await AppDataSource.initialize();
    
    // Clear old otps for 9999999999
    await AppDataSource.getRepository(Otp).delete({ identifier: '9999999999' });

    const hashedOtp = await bcrypt.hash('123456', 10);
    const otp = AppDataSource.getRepository(Otp).create({
        identifier: '9999999999',
        otp: hashedOtp,
        expiresAt: (Date.now() + 5 * 60 * 1000).toString(),
        type: 'login'
    });
    
    await AppDataSource.getRepository(Otp).save(otp);
    console.log("OTP 123456 inserted for 9999999999");
    await AppDataSource.destroy();
}

run().catch(console.error);
