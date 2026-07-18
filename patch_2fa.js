import fs from 'fs';

const filePath = 'apps/api/src/auth/services/auth.service.ts';
let content = fs.readFileSync(filePath, 'utf8');

const imports = `import * as crypto from 'crypto';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
`;

content = content.replace("import * as bcrypt from 'bcrypt';", "import * as bcrypt from 'bcrypt';\n" + imports);

const twoFactorLogic = `
    // --- 2FA Methods ---
    async generate2faSecret(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new UnauthorizedException('User not found');

        const secret = authenticator.generateSecret();
        user.twoFactorSecret = secret;
        await this.userRepository.save(user);

        const otpauthUrl = authenticator.keyuri(user.email, 'Ease2Event', secret);
        const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

        return { secret, qrCodeDataUrl };
    }

    async enable2fa(userId: string, otp: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) throw new BadRequestException('2FA not initialized');

        const isValid = authenticator.verify({ token: otp, secret: user.twoFactorSecret });
        if (!isValid) throw new BadRequestException('Invalid 2FA code');

        user.is2faEnabled = true;
        await this.userRepository.save(user);
        return { message: '2FA enabled successfully' };
    }

    async verify2faLogin(tempToken: string, otp: string) {
        let payload: any;
        try {
            payload = this.jwtService.verify(tempToken);
        } catch (e) {
            throw new UnauthorizedException('Invalid or expired temp token');
        }

        if (!payload.isTempToken) {
            throw new UnauthorizedException('Invalid token type');
        }

        const user = await this.userRepository.findOne({ where: { id: payload.sub } });
        if (!user || !user.is2faEnabled || !user.twoFactorSecret) {
            throw new UnauthorizedException('2FA not enabled for user');
        }

        const isValid = authenticator.verify({ token: otp, secret: user.twoFactorSecret });
        if (!isValid) {
            throw new UnauthorizedException('Invalid 2FA code');
        }

        // Return final JWT
        const finalPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const session = this.sessionRepository.create({
            userId: user.id,
            token: this.jwtService.sign(finalPayload),
            deviceInfo: '2FA Login',
            ipAddress: '0.0.0.0', // Ideally passed from req
            lastActive: new Date(),
        });
        await this.sessionRepository.save(session);

        return {
            access_token: session.token,
            user,
        };
    }
`;

// Insert the methods before the end of the class
content = content.replace(/}\s*$/, twoFactorLogic + '\n}\n');

fs.writeFileSync(filePath, content);
console.log('2FA methods added');
