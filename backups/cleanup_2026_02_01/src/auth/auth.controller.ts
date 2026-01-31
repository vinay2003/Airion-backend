import { Controller, Post, Get, Body, HttpCode, HttpStatus, Res, Req, UseGuards, UnauthorizedException, ServiceUnavailableException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // GET CURRENT USER
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() req: Request) {
        try {
            // If guard passes, user is authenticated
            if (!req.user) {
                throw new UnauthorizedException('User not authenticated');
            }
            return req.user;
        } catch (error) {
            // Check if it's a database connection error
            if (error.message?.includes('database') || error.message?.includes('connection')) {
                throw new ServiceUnavailableException('Database temporarily unavailable');
            }
            // Re-throw authentication errors
            throw error;
        }
    }

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

    // LOGOUT
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token');
        return { message: 'Logged out successfully' };
    }
}
