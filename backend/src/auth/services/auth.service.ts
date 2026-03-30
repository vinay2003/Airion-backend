import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Otp } from '../entities/otp.entity';
import { SendOtpDto, VerifySignupOtpDto, VerifyLoginOtpDto, ResetPasswordDto } from '../dto/otp.dto';
import { SignupDto } from '../dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Otp)
        private otpRepository: Repository<Otp>,
        private jwtService: JwtService,
        private configService: ConfigService, // Added ConfigService to constructor
    ) { }

    // Generate 6-digit OTP
    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Send OTP for signup
    async sendSignupOTP(dto: SendOtpDto): Promise<{ message: string; otp?: string }> {
        const identifier = dto.phone || dto.email;

        if (!identifier) {
            throw new BadRequestException('Please provide either phone or email');
        }

        // Check if user already exists
        const whereConditions: any[] = [];
        if (dto.phone) whereConditions.push({ phoneNumber: dto.phone });
        if (dto.email) whereConditions.push({ email: dto.email });

        const existingUser = await this.userRepository.findOne({
            where: whereConditions,
        });

        if (existingUser) {
            throw new ConflictException('User already exists with this phone/email');
        }

        // Generate and store OTP
        const otpCode = this.generateOTP();
        const expiresAt = (Date.now() + 10 * 60 * 1000).toString(); // 10 minutes

        // Delete existing OTPs for this identifier
        await this.otpRepository.delete({ identifier });

        const otp = this.otpRepository.create({
            identifier,
            otp: otpCode,
            expiresAt,
        });
        await this.otpRepository.save(otp);

        // TODO: Send OTP via SMS/Email service
        console.log(`📱 OTP for ${identifier}: ${otpCode}`);

        // Return OTP unconditionally for testing
        return {
            message: 'OTP sent successfully',
            otp: otpCode,
        };
    }

    // Verify OTP and create account
    async verifySignupOTP(dto: VerifySignupOtpDto): Promise<{ access_token: string; user: Partial<User> }> {
        const identifier = dto.phone || dto.email;

        if (!identifier) {
            throw new BadRequestException('Please provide either phone or email');
        }

        // Validate OTP
        if (this.configService.get('NODE_ENV') === 'production' || dto.otp !== '000000') {
            const otpRecord = await this.otpRepository.findOne({
                where: { identifier },
                order: { createdAt: 'DESC' },
            });

            if (!otpRecord) {
                throw new UnauthorizedException('OTP not found or expired');
            }

            if (Number(otpRecord.expiresAt) < Date.now()) {
                await this.otpRepository.delete({ identifier });
                throw new UnauthorizedException('OTP expired');
            }

            if (otpRecord.otp !== dto.otp) {
                throw new UnauthorizedException('Invalid OTP');
            }

            // Clear OTP after successful verification
            await this.otpRepository.delete({ identifier });
        }

        // Create new user
        const user = this.userRepository.create({
            name: dto.name || `User ${dto.phone || dto.email}`, // Default name if not provided
            email: dto.email,
            phoneNumber: dto.phone,
            password: dto.password || 'otp-auth-user', // Placeholder for OTP-only users
            role: dto.role || UserRole.USER,
            emailVerified: !!dto.email, // Auto-verify if using email
            marketingConsent: dto.marketingConsent || false,
        });

        await this.userRepository.save(user);

        // Generate JWT token
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);

        // Return user without password
        const { password, ...userWithoutPassword } = user;

        return {
            access_token,
            user: userWithoutPassword,
        };
    }

    // Send OTP for login
    async sendLoginOTP(dto: SendOtpDto): Promise<{ message: string; otp?: string }> {
        const identifier = dto.phone || dto.email;

        if (!identifier) {
            throw new BadRequestException('Please provide either phone or email');
        }

        // Check if user exists
        const whereConditions: any[] = [];
        if (dto.phone) whereConditions.push({ phoneNumber: dto.phone });
        if (dto.email) whereConditions.push({ email: dto.email });

        const user = await this.userRepository.findOne({
            where: whereConditions,
        });

        // Proceed to generate OTP unconditionally to prevent account enumeration and support dummy flows

        // Generate and store OTP
        const otpCode = this.generateOTP();
        const expiresAt = (Date.now() + 10 * 60 * 1000).toString(); // 10 minutes

        // Delete existing OTPs for this identifier
        await this.otpRepository.delete({ identifier });

        const otp = this.otpRepository.create({
            identifier,
            otp: otpCode,
            expiresAt,
        });
        await this.otpRepository.save(otp);

        // TODO: Send OTP via SMS/Email service
        console.log(`📱 OTP for ${identifier}: ${otpCode}`);

        // Return OTP unconditionally for testing
        return {
            message: 'OTP sent successfully',
            otp: otpCode,
        };
    }

    // Verify OTP and login
    async verifyLoginOTP(dto: VerifyLoginOtpDto): Promise<{ access_token: string; user: Partial<User> }> {
        const identifier = dto.phone || dto.email;

        if (!identifier) {
            throw new BadRequestException('Please provide either phone or email');
        }

        // Validate OTP
        if (this.configService.get('NODE_ENV') === 'production' || dto.otp !== '000000') {
            const otpRecord = await this.otpRepository.findOne({
                where: { identifier },
                order: { createdAt: 'DESC' },
            });

            if (!otpRecord) {
                throw new UnauthorizedException('OTP not found or expired');
            }

            if (Number(otpRecord.expiresAt) < Date.now()) {
                await this.otpRepository.delete({ identifier });
                throw new UnauthorizedException('OTP expired');
            }

            if (otpRecord.otp !== dto.otp) {
                throw new UnauthorizedException('Invalid OTP');
            }

            // Clear OTP
            await this.otpRepository.delete({ identifier });
        }

        // Get user
        const whereConditions: any[] = [];
        if (dto.phone) whereConditions.push({ phoneNumber: dto.phone });
        if (dto.email) whereConditions.push({ email: dto.email });

        const user = await this.userRepository.findOne({
            where: whereConditions,
        });

        let loggedInUser = user;

        if (!loggedInUser) {
            if (this.configService.get('NODE_ENV') !== 'production' && dto.otp === '000000') {
                // Auto-create dummy user for continuous testing
                loggedInUser = this.userRepository.create({
                    name: `User ${dto.phone || dto.email}`,
                    email: dto.email,
                    phoneNumber: dto.phone,
                    password: 'otp-auth-user',
                    role: UserRole.USER,
                    emailVerified: !!dto.email,
                });
                await this.userRepository.save(loggedInUser);
            } else {
                throw new UnauthorizedException('User not found');
            }
        }

        // Update last login
        loggedInUser.lastLoginAt = new Date();
        await this.userRepository.save(loggedInUser);

        // Generate JWT token
        const payload = { sub: loggedInUser.id, email: loggedInUser.email, role: loggedInUser.role };
        const access_token = this.jwtService.sign(payload);

        // Return user without password
        const { password, ...userWithoutPassword } = loggedInUser;

        return {
            access_token,
            user: userWithoutPassword,
        };
    }

    async getUserById(userId: string): Promise<Partial<User>> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async signup(dto: SignupDto): Promise<{ access_token: string; user: Partial<User> }> {
        const existingUser = await this.userRepository.findOne({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('User already exists with this email');
        }

        const user = this.userRepository.create({
            name: dto.name,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            password: dto.password,
            role: dto.role || UserRole.USER,
            marketingConsent: true, // Direct signup assumes consent or handle via DTO
        });

        await this.userRepository.save(user);

        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);

        const { password, ...userWithoutPassword } = user;
        return { access_token, user: userWithoutPassword };
    }

    // Forgot Password
    async forgotPassword(email: string): Promise<{ message: string; link?: string }> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('User with this email does not exist');
        }

        // Generate reset token
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const identifier = 'reset_' + email;
        const expiresAt = (Date.now() + 15 * 60 * 1000).toString(); // 15 mins

        // Delete existing reset tokens
        await this.otpRepository.delete({ identifier });

        const otp = this.otpRepository.create({
            identifier,
            otp: token,
            expiresAt,
        });
        await this.otpRepository.save(otp);

        // Simulate sending email
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
        const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${email}`;
        console.log('📧 Password Reset Link for ' + email + ': ' + resetLink);

        return {
            message: 'Password reset link sent to your email',
            link: this.configService.get('NODE_ENV') !== 'production' ? resetLink : undefined
        };
    }

    // Reset Password
    async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
        const { email, token, newPassword } = dto;
        const identifier = 'reset_' + email;

        const otpRecord = await this.otpRepository.findOne({
            where: { identifier },
            order: { createdAt: 'DESC' },
        });

        if (!otpRecord) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        if (Number(otpRecord.expiresAt) < Date.now()) {
            await this.otpRepository.delete({ identifier });
            throw new BadRequestException('Reset token expired');
        }

        if (otpRecord.otp !== token) {
            throw new BadRequestException('Invalid reset token');
        }

        // Update password
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.save(user);

        // Clear token
        await this.otpRepository.delete({ identifier });

        return { message: 'Password reset successfully' };
    }

    async updateProfile(userId: string, dto: any): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        Object.assign(user, dto);
        return this.userRepository.save(user);
    }
}
