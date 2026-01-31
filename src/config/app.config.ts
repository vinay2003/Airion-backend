import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    // Application
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),

    // Frontend URLs for CORS
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    vendorUrl: process.env.VENDOR_URL || 'http://localhost:5174',
    adminUrl: process.env.ADMIN_URL || 'http://localhost:5175',

    // JWT Configuration
    jwtSecret: process.env.JWT_SECRET || (() => {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('JWT_SECRET must be set in production');
        }
        return 'development-secret-change-in-production';
    })(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // Cloudinary Configuration
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },

    // Razorpay Configuration (optional)
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
    },

    // Feature Flags
    features: {
        enableCloudinaryUpload: !!(
            process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET
        ),
        enableRazorpayPayments: !!(
            process.env.RAZORPAY_KEY_ID &&
            process.env.RAZORPAY_KEY_SECRET
        ),
    },
}));
