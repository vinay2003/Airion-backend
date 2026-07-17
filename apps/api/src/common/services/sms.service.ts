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

        // Strip +91 prefix — Fast2SMS OTP route takes 10-digit Indian numbers
        const cleanNumber = phoneNumber.replace(/^\+91/, '').trim();

        const apiKey = this.configService.get<string>('FAST2SMS_API_KEY');

        // Send real SMS if API key is configured (works in both dev and prod)
        if (apiKey && apiKey !== 'your_fast2sms_api_key_here' && apiKey.length > 20) {
            try {
                // Use Fast2SMS OTP route — does NOT require DLT registration
                const response = await axios.get(
                    'https://www.fast2sms.com/dev/bulkV2',
                    {
                        params: {
                            authorization: apiKey,
                            route: 'otp',
                            variables_values: otp,
                            flash: 0,
                            numbers: cleanNumber,
                        },
                    }
                );

                this.logger.log(`📡 [FAST2SMS] Response: ${JSON.stringify(response.data)}`);

                if (response.data.return === true) {
                    this.logger.log(`✅ SMS dispatched to ${cleanNumber} successfully.`);
                } else {
                    const errorMsg = Array.isArray(response.data.message)
                        ? response.data.message.join(', ')
                        : response.data.message || 'Fast2SMS API failed';
                    throw new Error(errorMsg);
                }
            } catch (error: any) {
                const errorMsg = error?.response?.data?.message || error.message;
                this.logger.error(`❌ [SMS_ERROR] Failed to send OTP to ${cleanNumber}: ${errorMsg}`);

                if (this.configService.get('NODE_ENV') !== 'production') {
                    this.logger.warn(`⚠️ [DEV] SMS failed — OTP for ${cleanNumber} is: ${otp}`);
                    return; // Allow dev flow to continue
                }
                throw new InternalServerErrorException('Failed to send SMS OTP. Please try again later.');
            }
        } else {
            // No API key configured — log OTP for dev testing
            this.logger.warn(`[DEV SMS MOCK] 📱 -> To: ${cleanNumber} | Code: ${otp} | Context: ${context}`);
        }
    }
}
