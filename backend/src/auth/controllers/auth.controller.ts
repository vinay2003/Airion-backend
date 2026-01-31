import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SendOtpDto, VerifySignupOtpDto, VerifyLoginOtpDto } from '../dto/otp.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // Send OTP for signup
    @Post('signup/send-otp')
    async sendSignupOTP(@Body() dto: SendOtpDto) {
        return this.authService.sendSignupOTP(dto);
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
}
