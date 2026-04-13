import * as crypto from 'crypto';

/**
 * 🔐 Cryptographic Utility Suite
 * Provides production-grade randomness for identifiers, OTPs, and security tokens.
 */
export class CryptoUtil {
    /**
     * Generates a secure numeric OTP of specified length.
     * Uses crypto.randomInt for uniform distribution.
     */
    static generateOTP(length = 6): string {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return crypto.randomInt(min, max + 1).toString();
    }

    /**
     * Generates a high-entropy secure token.
     * Used for refresh tokens and recovery ciphers.
     */
    static generateSecureToken(bytes = 32): string {
        return crypto.randomBytes(bytes).toString('hex');
    }

    /**
     * Creates a SHA-256 hash of a value.
     * Used for storing refresh tokens and other sensitive non-password identifiers.
     */
    static hashValue(value: string): string {
        return crypto.createHash('sha256').update(value).digest('hex');
    }
}
