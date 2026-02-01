import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../entities/user.entity';
import { SendOtpDto, VerifySignupOtpDto, VerifyLoginOtpDto, ResetPasswordDto } from '../dto/otp.dto';
import { SignupDto } from '../dto/signup.dto';

// Simple in-memory OTP storage (use Redis in production)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
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
        const existingUser = await this.userRepository.findOne({
            where: dto.phone ? { phoneNumber: dto.phone } : { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('User already exists with this phone/email');
        }

        // Generate and store OTP
        const otp = this.generateOTP();
        otpStore.set(identifier, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        });

        // TODO: Send OTP via SMS/Email service
        console.log(`📱 OTP for ${identifier}: ${otp}`);

        // Return OTP in development mode
        return {
            message: 'OTP sent successfully',
            ...(process.env.NODE_ENV === 'development' && { otp }),
        };
    }

    // Verify OTP and create account
    async verifySignupOTP(dto: VerifySignupOtpDto): Promise<{ access_token: string; user: Partial<User> }> {
        const identifier = dto.phone || dto.email;

        if (!identifier) {
            throw new BadRequestException('Please provide either phone or email');
        }

        // Validate OTP
        const storedData = otpStore.get(identifier);

        if (!storedData) {
            throw new UnauthorizedException('OTP not found or expired');
        }

        if (storedData.expiresAt < Date.now()) {
            otpStore.delete(identifier);
            throw new UnauthorizedException('OTP expired');
        }

        if (storedData.otp !== dto.otp) {
            throw new UnauthorizedException('Invalid OTP');
        }

        // Clear OTP after successful verification
        otpStore.delete(identifier);

        // Create new user
        const user = this.userRepository.create({
            name: dto.name || `User ${dto.phone || dto.email}`, // Default name if not provided
            email: dto.email,
            phoneNumber: dto.phone,
            password: dto.password || 'otp-auth-user', // Placeholder for OTP-only users
            role: dto.role || UserRole.USER,
            emailVerified: !!dto.email, // Auto-verify if using email
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
        const user = await this.userRepository.findOne({
            where: dto.phone ? { phoneNumber: dto.phone } : { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('No account found with this phone/email');
        }

        // Generate and store OTP
        const otp = this.generateOTP();
        otpStore.set(identifier, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        });

        // TODO: Send OTP via SMS/Email service
        console.log(`📱 OTP for ${identifier}: ${otp}`);

        // Return OTP in development mode
        return {
            message: 'OTP sent successfully',
            ...(process.env.NODE_ENV === 'development' && { otp }),
        };
    }

    // Verify OTP and login
    async verifyLoginOTP(dto: VerifyLoginOtpDto): Promise<{ access_token: string; user: Partial<User> }> {
        const identifier = dto.phone || dto.email;

        if (!identifier) {
            throw new BadRequestException('Please provide either phone or email');
        }

        // Validate OTP
        const storedData = otpStore.get(identifier);

        if (!storedData) {
            throw new UnauthorizedException('OTP not found or expired');
        }

        if (storedData.expiresAt < Date.now()) {
            otpStore.delete(identifier);
            throw new UnauthorizedException('OTP expired');
        }

        if (storedData.otp !== dto.otp) {
            throw new UnauthorizedException('Invalid OTP');
        }

        // Clear OTP
        otpStore.delete(identifier);

        // Get user
        const user = await this.userRepository.findOne({
            where: dto.phone ? { phoneNumber: dto.phone } : { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Update last login
        user.lastLoginAt = new Date();
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

        // Store in memory
        otpStore.set('reset_' + email, {
            otp: token,
            expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
        });

        // Simulate sending email
        const resetLink = 'http://localhost:5173/reset-password?token=' + token + '&email=' + email;
        console.log('📧 Password Reset Link for ' + email + ': ' + resetLink);

        return {
            message: 'Password reset link sent to your email',
            ...(process.env.NODE_ENV === 'development' && { link: resetLink })
        };
    }

    // Reset Password
    async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
        const { email, token, newPassword } = dto;
        const storedData = otpStore.get('reset_' + email);

        if (!storedData) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        if (storedData.expiresAt < Date.now()) {
            otpStore.delete('reset_' + email);
            throw new BadRequestException('Reset token expired');
        }

        if (storedData.otp !== token) {
            throw new BadRequestException('Invalid reset token');
        }

        // Update password
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        user.password = newPassword;
        await this.userRepository.save(user);

        // Clear token
        otpStore.delete('reset_' + email);

        return { message: 'Password reset successfully' };
    }
}
