import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);
    private readonly isProduction: boolean;

    constructor(private configService: ConfigService) {
        this.isProduction = this.configService.get('NODE_ENV') === 'production';
    }

    /**
     * Sends an OTP via SMS to the provided phone number.
     * @param phoneNumber The recipient's phone number
     * @param otp The 6-digit OTP code
     * @param context Context of the OTP (e.g. signup, login, admin_login)
     */
    async sendOtpSms(phoneNumber: string, otp: string, context: string): Promise<void> {
        this.logger.log(`Dispatching SMS OTP [${context}] to ${phoneNumber}`);

        // Strip the +91 if it exists since Fast2SMS usually takes 10-digit numbers for India
        const cleanNumber = phoneNumber.replace(/^\+91/, '').trim();
        
        const apiKey = this.configService.get<string>('FAST2SMS_API_KEY');

        // Send real SMS if we are in production OR if an API key is provided (for dev testing)
        if (this.isProduction || (apiKey && apiKey !== 'your_fast2sms_api_key_here' && apiKey.length > 20)) {
            
            if (!apiKey) {
                this.logger.error('❌ FAST2SMS_API_KEY is missing. SMS not sent.');
                throw new InternalServerErrorException('SMS service is not configured properly.');
            }

            try {
                // Using Fast2SMS Quick Transactional Route
                const response = await axios.post(
                    'https://www.fast2sms.com/dev/bulkV2',
                    {
                        route: 'v3',
                        sender_id: 'TXTIND', // Default sender ID
                        message: `Your Ease2event verification code is: ${otp}. Do not share this with anyone.`,
                        language: 'english',
                        flash: 0,
                        numbers: cleanNumber,
                    },
                    {
                        headers: {
                            authorization: apiKey,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data.return === true) {
                    this.logger.log(`✅ SMS dispatched to ${phoneNumber} successfully.`);
                } else {
                    throw new Error(response.data.message || 'Fast2SMS API failed');
                }
            } catch (error: any) {
                const errorMsg = error?.response?.data?.message || error.message;
                this.logger.error(`❌ [SMS_ERROR] Failed to send OTP to ${phoneNumber}: ${errorMsg}`);
                
                if (!this.isProduction) {
                    this.logger.warn(`⚠️ SMS failed, but allowing dev flow to continue. USE THIS OTP: ${otp}`);
                    return;
                }
                throw new InternalServerErrorException(errorMsg.includes('100 INR') ? 'SMS API requires ₹100 wallet balance.' : 'Failed to send SMS OTP. Please try again later.');
            }
        } else {
            // In development with no API key, just log the OTP for easy testing
            this.logger.debug(`[DEV SMS MOCK] 📱 -> To: ${phoneNumber} | Code: ${otp} | Context: ${context}`);
        }
    }
}
