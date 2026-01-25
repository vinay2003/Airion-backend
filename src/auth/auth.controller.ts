import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // LOGIN FLOW
    @Post('login/send-otp')
    @HttpCode(HttpStatus.OK)
    async sendLoginOtp(@Body() sendOtpDto: SendOtpDto) {
        return this.authService.sendLoginOtp(sendOtpDto);
    }

    @Post('admin/login')
    @HttpCode(HttpStatus.OK)
    async adminLogin(@Body() loginDto: LoginDto) {
        return this.authService.adminLogin(loginDto);
    }

    @Post('login/verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyLoginOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyLoginOtp(verifyOtpDto);
    }

    // SIGNUP FLOW
    @Post('signup/send-otp')
    @HttpCode(HttpStatus.OK)
    async sendSignupOtp(@Body() sendOtpDto: SendOtpDto) {
        return this.authService.sendSignupOtp(sendOtpDto);
    }

    @Post('signup/verify-otp')
    @HttpCode(HttpStatus.CREATED)
    async verifySignupOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifySignupOtp(verifyOtpDto);
    }
}
