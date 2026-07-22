import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { SendOtpDto, VerifySignupOtpDto, VerifyLoginOtpDto, ChangePasswordDto } from '../dto/otp.dto';
import { SignupDto } from '../dto/signup.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // Send OTP for signup
    @Post('signup/send-otp')
    async sendSignupOTP(@Body() dto: SendOtpDto) {
        return this.authService.sendSignupOTP(dto);
    }

    // Direct Password Signup
    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    // Verify OTP and create account
    @Post('signup/verify-otp')
    async verifySignupOTP(@Body() dto: VerifySignupOtpDto) {
        return this.authService.verifySignupOTP(dto);
    }

    // Send OTP for login
    @Post('login/send-otp')
    @HttpCode(HttpStatus.OK)
    async sendLoginOTP(@Body() dto: SendOtpDto) {
        return this.authService.sendLoginOTP(dto);
    }

    // Verify OTP and login
    @Post('login/verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyLoginOTP(@Body() dto: VerifyLoginOtpDto) {
        return this.authService.verifyLoginOTP(dto);
    }

    // Verify Firebase Token and login/register
    @Post('firebase/verify-token')
    @HttpCode(HttpStatus.OK)
    async verifyFirebaseToken(@Body() dto: { idToken: string; role: UserRole }) {
        return this.authService.verifyFirebaseToken(dto.idToken, dto.role);
    }

    // Admin Flow: Send OTP
    @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 per hour
    @Post('admin/send-otp')
    @HttpCode(HttpStatus.OK)
    async sendAdminOTP(@Body() dto: { email: string }) {
        return this.authService.sendAdminOtp(dto);
    }

    // Admin Flow: Verify OTP
    @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 per hour
    @Post('admin/verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyAdminOTP(@Body() dto: { email: string; otp: string }) {
        return this.authService.verifyAdminOtp(dto);
    }

    // Get current user profile
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req: any) {
        return this.authService.getUserById(req.user.userId);
    }

    // Logout (client-side for JWT)
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout() {
        return { message: 'Logged out successfully' };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() dto: { refresh_token: string }) {
        return this.authService.refreshToken(dto.refresh_token);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dto: { email: string }) {
        return this.authService.forgotPassword(dto.email);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: any) { // using any for simplicity or import DTO
        return this.authService.resetPassword(dto);
    }

    @Patch('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER, UserRole.VENDOR, UserRole.ADMIN)
    async updateProfile(@Request() req: any, @Body() dto: any) {
        return this.authService.updateProfile(req.user.userId, dto);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
        try {
            return await this.authService.changePassword(req.user.userId, dto);
        } catch (error: any) {
            console.error('[changePassword Error]:', error);
            throw error;
        }
    }
}
