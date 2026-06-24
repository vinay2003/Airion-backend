const fs = require('fs');
const path = '/Users/vinaysharma/Desktop/airion/apps/api/src/auth/services/auth.service.ts';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove isDummy from verifySignupOTP
code = code.replace(/const isDummy = dto\.otp === '000000';\s*\n/, '');
code = code.replace(/if \(\!isDummy\) \{/g, 'if (true) {');

// 2. Remove isDummy from verifyLoginOTP
code = code.replace(/const isDummy = \(process\.env\.NODE_ENV !== 'production' \|\| this\.configService\.get\('NODE_ENV'\) !== 'production'\) && dto\.otp === '000000';\s*\n/, '');

// 3. Make abhishekkumar518@gmail.com the admin automatically in verifySignupOTP
code = code.replace(
    "role: dto.role || UserRole.USER,",
    "role: dto.email === 'abhishekkumar518@gmail.com' ? UserRole.ADMIN : (dto.role || UserRole.USER),"
);

// 4. In verifyLoginOTP, if user not found, auto-create ONLY if they are abhishekkumar518@gmail.com
code = code.replace(
    /if \(this\.configService\.get\('NODE_ENV'\) !== 'production' && dto\.otp === '000000'\) \{[\s\S]*?\} else \{/,
    `if (dto.email === 'abhishekkumar518@gmail.com') {
                const userData = {
                    name: 'Admin',
                    email: dto.email,
                    phoneNumber: dto.phone,
                    password: 'otp-auth-user',
                    role: UserRole.ADMIN,
                    emailVerified: true,
                };
                loggedInUser = this.userRepository.create(userData as any) as unknown as User;
                await this.userRepository.save(loggedInUser);
            } else {`
);

// We should also remove the remaining 'if (!isDummy)' check inside verifyLoginOTP
code = code.replace(
    /\/\/ Validate if not dummy\s+if \(\!isDummy\) \{/,
    '// Validate\n        if (true) {'
);

fs.writeFileSync(path, code);
