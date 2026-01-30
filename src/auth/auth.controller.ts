import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
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
    async adminLogin(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.adminLogin(loginDto);
        if (result.access_token) {
            res.cookie('token', result.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
        }
        return result;
    }

    @Post('login/verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyLoginOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.verifyLoginOtp(verifyOtpDto);
        if (result.access_token) {
            res.cookie('token', result.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
        }
        return result;
    }

    // SIGNUP FLOW
    @Post('signup/send-otp')
    @HttpCode(HttpStatus.OK)
    async sendSignupOtp(@Body() sendOtpDto: SendOtpDto) {
        return this.authService.sendSignupOtp(sendOtpDto);
    }

    @Post('signup/verify-otp')
    @HttpCode(HttpStatus.CREATED)
    async verifySignupOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.verifySignupOtp(verifyOtpDto);
        if (result.access_token) {
            res.cookie('token', result.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
        }
        return result;
    }
}
