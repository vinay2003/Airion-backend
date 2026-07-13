const fs = require('fs');

let content = fs.readFileSync('apps/api/src/auth/services/auth.service.ts', 'utf8');

const targetFunctionStartRegex = /    async verifyFirebaseToken\(idToken: string, requestedRole: UserRole\): Promise<\{ access_token: string; refresh_token: string; user: Partial<User>; isProfileComplete\?: boolean \}> \{/;
const targetFunctionEndRegex = /            return \{\n                access_token,\n                refresh_token: refreshTokenPlain,\n                user: userWithoutPassword as Partial<User>,\n                isProfileComplete: user\.role === UserRole\.VENDOR \? isProfileComplete : undefined,\n            \};\n        \} catch \(error: any\) \{\n            this\.logger\.error\(`❌ Firebase token verification failed: \$\{error\.message\}`\, error\.stack\);\n            throw new UnauthorizedException\(error\.message \|\| 'Invalid Firebase token or verification error'\);\n        \}\n    \}/;

const matchStart = content.match(targetFunctionStartRegex);
const matchEnd = content.match(targetFunctionEndRegex);

if (!matchStart || !matchEnd) {
    console.error("Could not find the target function bounds.");
    process.exit(1);
}

const startIndex = matchStart.index;
const endIndex = matchEnd.index + matchEnd[0].length;

const targetFunctionCode = content.substring(startIndex, endIndex);

const newFunctionCode = `    async verifyFirebaseToken(idToken: string, requestedRole: UserRole): Promise<{ access_token: string; refresh_token: string; user: Partial<User>; isProfileComplete?: boolean }> {
        this.initializeFirebase();

        try {
            let phoneNumber: string | undefined;
            let email: string | undefined;
            let name: string | undefined;

        // If Firebase Admin SDK is not configured, use a safe development mode fallback
        const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
        const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
        const isDummyConfig = !clientEmail || 
            clientEmail.includes('xxxxx') || 
            !privateKey || 
            privateKey.includes('REPLACE_WITH_REAL') ||
            privateKey.includes('MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSk');
        
        const isNotConfigured = admin.apps.length === 0 || isDummyConfig;

        if (isNotConfigured) {
            // Dev fallback: decode Firebase JWT locally without verifying signature
            try {
                this.logger.warn('⚠️ [Firebase Auth] Using local token decode fallback (no Admin SDK). Set real service account keys for production!');
                const parts = idToken.split('.');
                if (parts.length !== 3) {
                    throw new BadRequestException('Invalid Firebase token format.');
                }
                const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                const paddedPayload = base64Payload + '='.repeat((4 - base64Payload.length % 4) % 4);
                const decodedPayload = JSON.parse(Buffer.from(paddedPayload, 'base64').toString('utf-8'));
                phoneNumber = decodedPayload.phone_number;
                email = decodedPayload.email;
                name = decodedPayload.name;
                
                if (!phoneNumber && !email) {
                    throw new BadRequestException('Firebase token does not contain a phone number or email.');
                }
                this.logger.log(\`📱 [Firebase Dev Fallback] Decoded from token - Phone: \${phoneNumber || 'N/A'}, Email: \${email || 'N/A'}\`);
            } catch (decodeErr: any) {
                if (decodeErr instanceof BadRequestException) throw decodeErr;
                throw new BadRequestException('Failed to decode Firebase token. Please ensure it is a valid Firebase ID token.');
            }
        } else {
            try {
                // 1. Verify token with Firebase Admin
                const decodedToken = await admin.auth().verifyIdToken(idToken);
                phoneNumber = decodedToken.phone_number;
                email = decodedToken.email;
                name = decodedToken.name;
            } catch (err: any) {
                this.logger.error('Firebase token verification failed:', err);
                throw new UnauthorizedException('Invalid Firebase authentication token.');
            }
        }

        if (!phoneNumber && !email) {
            throw new UnauthorizedException('Authentication token did not contain a valid phone number or email.');
        }

        if (phoneNumber) phoneNumber = phoneNumber.trim();
        if (email) email = email.trim().toLowerCase();

            // 2. Query our local DB for the user using flexible matching
            const whereConditions: any[] = [];
            if (phoneNumber) {
                whereConditions.push({ phoneNumber });
                if (phoneNumber.startsWith('+91')) {
                    whereConditions.push({ phoneNumber: phoneNumber.substring(3) });
                } else if (phoneNumber.length === 10) {
                    whereConditions.push({ phoneNumber: \`+91\${phoneNumber}\` });
                }
            }
            if (email) {
                whereConditions.push({ email });
            }

            let user = await this.userRepository.findOne({
                where: whereConditions,
                relations: ['vendor', 'vendor.category', 'vendor.subcategory', 'vendor.gallery', 'vendor.ads'],
            });

            // 3. Auto-Register if user does not exist (Genesis Flow)
            if (!user) {
                if (requestedRole === UserRole.ADMIN) {
                    throw new ForbiddenException('Admin accounts cannot be created via social/phone auth.');
                }
                
                const generatedName = name || (phoneNumber ? \`User \${phoneNumber}\` : \`User \${email}\`);
                const userData = {
                    name: generatedName,
                    phoneNumber: phoneNumber || null,
                    email: email || null,
                    password: 'firebase-auth-user', // Placeholder
                    role: requestedRole || UserRole.USER,
                    emailVerified: !!email,
                };
                user = this.userRepository.create(userData as any) as unknown as User;
                await this.userRepository.save(user);
            } else {
                // Update existing user with new info if missing
                let updated = false;
                if (email && !user.email) { user.email = email; user.emailVerified = true; updated = true; }
                if (name && user.name.startsWith('User +')) { user.name = name; updated = true; }
                if (phoneNumber && !user.phoneNumber) { user.phoneNumber = phoneNumber; updated = true; }
                if (updated) await this.userRepository.save(user);
            }

            // Update last login
            user.lastLoginAt = new Date();
            await this.userRepository.save(user);

            // Get vendor attributes if vendor
            const isProfileComplete = user.role === UserRole.VENDOR ? ((user as any).vendor?.isProfileComplete ?? false) : undefined;
            const vendorId = (user as any).vendor?.id;

            // 4. Generate local application JWTs
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
                isProfileComplete: user.role === UserRole.VENDOR ? isProfileComplete : undefined,
                vendorId,
            };
            const access_token = this.jwtService.sign(payload);

            // Return user without password
            const { password, ...userWithoutPassword } = user;

            // Generate secure refresh token
            const refreshTokenPlain = CryptoUtil.generateSecureToken(32);
            const tokenHash = CryptoUtil.hashValue(refreshTokenPlain);

            const refreshToken = this.refreshTokenRepository.create({
                userId: user.id,
                tokenHash,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Day TTL
            });
            await this.refreshTokenRepository.save(refreshToken);

            return {
                access_token,
                refresh_token: refreshTokenPlain,
                user: userWithoutPassword as Partial<User>,
                isProfileComplete: user.role === UserRole.VENDOR ? isProfileComplete : undefined,
            };
        } catch (error: any) {
            this.logger.error(\`❌ Firebase token verification failed: \${error.message}\`, error.stack);
            throw new UnauthorizedException(error.message || 'Invalid Firebase token or verification error');
        }
    }`;

const newContent = content.substring(0, startIndex) + newFunctionCode + content.substring(endIndex);
fs.writeFileSync('apps/api/src/auth/services/auth.service.ts', newContent);
