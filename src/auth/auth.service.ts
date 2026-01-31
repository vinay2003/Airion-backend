import { Injectable, UnauthorizedException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { Otp } from './entities/otp.entity';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';

import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Otp) private otpRepository: Repository<Otp>,
        private jwtService: JwtService,
    ) { }

    // 1. Send Login OTP
    async sendLoginOtp(sendOtpDto: SendOtpDto) {
        const { phone } = sendOtpDto;

        // Check if user exists
        const user = await this.userRepository.findOneBy({ phone });
        if (!user) {
            throw new NotFoundException('User not found. Please signup first.');
        }

        // Generate and Send OTP
        const otp = this.generateOtp();
        await this.saveOtp(phone, otp);

        // MOCK SMS SENDING - Enhanced console output
        console.log('\n' + '='.repeat(60));
        console.log('📨 [LOGIN OTP SENT]');
        console.log('Phone:', phone);
        console.log('OTP:', otp);
        console.log('='.repeat(60) + '\n');

        this.logger.log(`Login OTP for ${phone}: ${otp}`);

        return {
            message: 'OTP sent successfully. Check server console for OTP.',
            otp: otp, // TEMPORARY: Return OTP to frontend for dev convenience
            phone: phone
        };
    }

    // 2. Verify Login OTP
    async verifyLoginOtp(verifyOtpDto: VerifyOtpDto) {
        const { phone, otp } = verifyOtpDto;

        // Verify OTP
        await this.validateOtp(phone, otp);

        const user = await this.userRepository.findOneBy({ phone });
        if (!user) {
            throw new NotFoundException('User not found.');
        }

        // Generate Token
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    }

    // 3. Send Signup OTP
    async sendSignupOtp(sendOtpDto: SendOtpDto) {
        const { phone, email } = sendOtpDto;

        // Check if user already exists
        const existingUser = await this.userRepository.findOneBy({ phone, isVerified: true });
        if (existingUser) {
            throw new ConflictException('User with this mobile number already exists. Please login.');
        }

        // Generate and Send OTP
        const otp = this.generateOtp();
        await this.saveOtp(phone, otp);

        // MOCK SMS SENDING - Enhanced console output
        console.log('\n' + '='.repeat(60));
        console.log('📨 [SIGNUP OTP SENT]');
        console.log('Phone:', phone);
        console.log('Email:', email || 'N/A');
        console.log('OTP:', otp);
        console.log('='.repeat(60) + '\n');

        this.logger.log(`Signup OTP for ${phone}: ${otp}`);

        return {
            message: 'OTP sent successfully. Check server console for OTP.',
            otp: otp, // TEMPORARY: Return OTP to frontend for dev convenience
            phone: phone
        };
    }

    // 4. Verify Signup OTP & Create Account
    async verifySignupOtp(verifyOtpDto: VerifyOtpDto) {
        const { phone, otp, name, email, role, password } = verifyOtpDto;

        // Verify OTP
        await this.validateOtp(phone, otp);

        // Check if account exists (could be unverified try)
        let user = await this.userRepository.findOneBy({ phone });

        if (user && user.isVerified) {
            throw new ConflictException('User already verified. Please login.');
        }

        if (!user) {
            if (!name || !email) {
                throw new UnauthorizedException('Name and Email are required for new signup verification.');
            }
            // Hash password if provided
            let hashedPassword = null;
            if (verifyOtpDto.password) {
                hashedPassword = await bcrypt.hash(verifyOtpDto.password, 10);
            }

            // Create new user
            const userData: DeepPartial<User> = {
                name,
                email,
                phone,
                role: (role as Role) || Role.USER,
                isVerified: true,
            };

            if (hashedPassword) {
                userData.password = hashedPassword;
            }

            user = this.userRepository.create(userData);
        } else {
            // Update existing unverified user checks could go here, but for now assuming clean create
            user.name = name || user.name;
            user.email = email || user.email;
            user.isVerified = true;
        }

        await this.userRepository.save(user);

        // Generate Token
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    }

    // 5. Admin Login (Email/Password)
    async adminLogin(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Use query builder to select hidden password
        const user = await this.userRepository.createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.role !== 'admin') {
            throw new UnauthorizedException('Access denied');
        }

        // Use bcrypt to compare password
        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch) {
            console.log('Password mismatch');
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    }

    // Helper: Generate 6-digit OTP
    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Helper: Save OTP to DB
    private async saveOtp(phone: string, otp: string) {
        await this.otpRepository.delete({ phone }); // Delete old OTPs
        const newOtp = this.otpRepository.create({ phone, otp });
        await this.otpRepository.save(newOtp);
    }

    // Helper: Validate OTP
    private async validateOtp(phone: string, otp: string) {
        const otpRecord = await this.otpRepository.findOneBy({ phone });

        console.log(`[DEBUG] Verifying OTP for ${phone}`);
        console.log(`[DEBUG] Received: '${otp}'`);
        console.log(`[DEBUG] Stored:   '${otpRecord?.otp}'`);

        if (!otpRecord) {
            throw new UnauthorizedException('Invalid or expired OTP.');
        }

        if (otpRecord.otp !== otp) {
            throw new UnauthorizedException('Invalid OTP.');
        }

        // OTP is valid, remove it to prevent reuse
        await this.otpRepository.delete({ phone });
    }
}
