import fs from 'fs';

const filePath = 'apps/api/src/auth/services/auth.service.ts';
let content = fs.readFileSync(filePath, 'utf8');

const oldQuery = `SELECT id, name, phone_number as "phoneNumber", role FROM users WHERE phone_number = $1 AND role = 'admin' LIMIT 1`;
const newQuery = `SELECT id, name, phone_number as "phoneNumber", role, is_2fa_enabled as "is2faEnabled" FROM users WHERE phone_number = $1 AND role = 'admin' LIMIT 1`;

content = content.replace(oldQuery, newQuery);

const oldSuccessLogic = `        const payload = {
            sub: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
        };

        const session = this.sessionRepository.create({
            userId: adminUser.id,
            token: this.jwtService.sign(payload),
            deviceInfo: dto.deviceInfo || 'Unknown Device',
            ipAddress: dto.ipAddress || '0.0.0.0',
            lastActive: new Date(),
        });
        await this.sessionRepository.save(session);

        this.logger.log(\`✅ [ADMIN_AUDIT] Successful login for admin: \${adminUser.id}\`);

        return {
            access_token: session.token,
            user: adminUser,
        };`;

const newSuccessLogic = `        if (adminUser.is2faEnabled) {
            const tempPayload = {
                sub: adminUser.id,
                isTempToken: true,
            };
            const tempToken = this.jwtService.sign(tempPayload, { expiresIn: '5m' });
            return {
                require2fa: true,
                tempToken,
                user: adminUser,
            } as any;
        }

        const payload = {
            sub: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
        };

        const session = this.sessionRepository.create({
            userId: adminUser.id,
            token: this.jwtService.sign(payload),
            deviceInfo: dto.deviceInfo || 'Unknown Device',
            ipAddress: dto.ipAddress || '0.0.0.0',
            lastActive: new Date(),
        });
        await this.sessionRepository.save(session);

        this.logger.log(\`✅ [ADMIN_AUDIT] Successful login for admin: \${adminUser.id}\`);

        return {
            access_token: session.token,
            user: adminUser,
        };`;

content = content.replace(oldSuccessLogic, newSuccessLogic);
fs.writeFileSync(filePath, content);
console.log('patched verifyAdminOtp');
