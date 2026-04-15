import { createZodDto } from 'nestjs-zod';
import { 
  SendOtpSchema, 
  VerifyOtpSchema, 
  ResetPasswordSchema 
} from '@ease2event/types';

export class SendOtpDto extends createZodDto(SendOtpSchema) {
  phone?: string;
  email?: string;
}

export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {
  phone?: string;
  email?: string;
  otp: string;
}

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {
  email: string;
  token: string;
  newPassword: string;
}

/** Legacy/Compatibility Aliases if needed by controllers */
export class VerifySignupOtpDto extends VerifyOtpDto {
  email?: string;
  phone?: string;
  otp: string;
  name?: string;
  password?: string;
  role?: any;
  marketingConsent?: boolean;
}

export class VerifyLoginOtpDto extends VerifyOtpDto {
  email?: string;
  phone?: string;
  otp: string;
  role?: any;
}
