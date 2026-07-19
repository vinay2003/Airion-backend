import { Controller, Post, Delete, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth/2fa')
export class TwoFactorController {
    constructor(private authService: AuthService) {}

    /**
     * Step 1 of 2FA setup: generate a TOTP secret and QR code.
     * The user must scan this QR code with Google Authenticator / Authy.
     */
    @UseGuards(JwtAuthGuard)
    @Post('generate')

    async generate2faSecret(@Request() req: any) {
        return this.authService.generate2faSecret(req.user.userId);
    }

    /**
     * Step 2 of 2FA setup: confirm setup by verifying a TOTP code.
     * Enables 2FA for the account once verified.
     */
    @UseGuards(JwtAuthGuard)
    @Post('enable')

    async enable2fa(@Request() req: any, @Body() dto: { otp: string }) {
        return this.authService.enable2fa(req.user.userId, dto.otp);
    }

    /**
     * During admin login: exchange temp token + TOTP code for a full session.
     * Called after verifyAdminOtp returns require2fa=true.
     */
    @Post('verify')
    @Throttle({ default: { limit: 10, ttl: 900000 } }) // 10 attempts per 15 minutes
    async verify2faLogin(@Body() dto: { tempToken: string; otp: string }) {
        return this.authService.verify2faLogin(dto.tempToken, dto.otp);
    }

    /**
     * Disable 2FA — requires current TOTP code for confirmation.
     */
    @UseGuards(JwtAuthGuard)
    @Delete('disable')

    async disable2fa(@Request() req: any, @Body() dto: { otp: string }) {
        return this.authService.disable2fa(req.user.userId, dto.otp);
    }
}
