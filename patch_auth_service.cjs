import * as fs from 'fs';

const filePath = 'apps/api/src/auth/services/auth.service.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace forgotPassword token generation
content = content.replace(
    /const token = Math\.random\(\)\.toString\(36\)\.substring\(2, 15\) \+ Math\.random\(\)\.toString\(36\)\.substring\(2, 15\);/,
    "const token = require('crypto').randomBytes(32).toString('hex');"
);

// Delete OTP after resetPassword
const resetPasswordUpdate = `        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.save(user);

        // Invalidate token after successful use
        await this.otpRepository.delete({ identifier });`;

content = content.replace(
    /user\.password = await bcrypt\.hash\(newPassword, 10\);\s+await this\.userRepository\.save\(user\);/,
    resetPasswordUpdate
);

fs.writeFileSync(filePath, content);
console.log('auth.service.ts patched');
