import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter | null = null;

    constructor(private configService: ConfigService) {
        this.initTransporter();
    }

    private initTransporter() {
        const user = this.configService.get<string>('SMTP_USER');
        const pass = this.configService.get<string>('SMTP_PASS');

        if (!user || !pass) {
            this.logger.warn('⚠️ [Email] SMTP credentials not configured. Emails will be logged to console only.');
            this.logger.warn('   → Set SMTP_USER and SMTP_PASS in .env.development to enable real emails.');
            return;
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });

        this.logger.log('📧 [Email] Gmail SMTP transporter initialized.');
    }

    async sendOtpEmail(to: string, otp: string, purpose: 'login' | 'signup'): Promise<void> {
        const subject = purpose === 'signup'
            ? 'Your Ease2event Signup Verification Code'
            : 'Your Ease2event Login Verification Code';

        const html = this.buildOtpEmailTemplate(otp, purpose);

        // Always log OTP in dev for testing without real SMTP
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        if (!isProduction) {
            this.logger.log(`🔑 [EMAIL OTP] To: ${to} | Code: ${otp} | Purpose: ${purpose}`);
        }

        if (!this.transporter) {
            this.logger.warn(`📭 [Email] No SMTP configured — OTP logged above only. Set SMTP_USER + SMTP_PASS to send real emails.`);
            return;
        }

        try {
            const from = this.configService.get<string>('SMTP_FROM') || this.configService.get<string>('SMTP_USER');
            await this.transporter.sendMail({
                from: `"Ease2event" <${from}>`,
                to,
                subject,
                html,
            });
            this.logger.log(`✅ [Email] OTP email sent to: ${to}`);
        } catch (error: any) {
            this.logger.error(`❌ [Email] Failed to send OTP email to ${to}: ${error.message}`);
            // Don't throw — let auth flow continue. OTP is still in DB and logged above.
        }
    }

    private buildOtpEmailTemplate(otp: string, purpose: 'login' | 'signup'): string {
        const action = purpose === 'signup' ? 'complete your registration' : 'sign in to your account';
        const currentYear = new Date().getFullYear();

        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ease2event OTP</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#dc2626;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Ease2event</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Premium Event Planning Platform</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 32px;">
              <p style="margin:0 0 8px;color:#64748b;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Verification Code</p>
              <h2 style="margin:0 0 24px;color:#0f172a;font-size:24px;font-weight:700;">
                Use this code to ${action}
              </h2>
              
              <!-- OTP Box -->
              <div style="background:#f8fafc;border:2px dashed #e2e8f0;border-radius:12px;padding:32px;text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Your Code</p>
                <p style="margin:0;color:#dc2626;font-size:48px;font-weight:800;letter-spacing:12px;font-family:'Courier New',monospace;">${otp}</p>
              </div>

              <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
                This code is valid for <strong>5 minutes</strong>. Do not share it with anyone.
              </p>
              <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
                If you did not request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                © ${currentYear} Ease2event. All rights reserved.<br/>
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim();
    }
}
