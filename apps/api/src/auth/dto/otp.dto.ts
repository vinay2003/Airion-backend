import { createZodDto } from 'nestjs-zod';
import { 
  SendOtpSchema, 
  VerifyOtpSchema, 
  ResetPasswordSchema 
} from '@airion/types';

export class SendOtpDto extends createZodDto(SendOtpSchema) {}
export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {}
export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}

/** Legacy/Compatibility Aliases if needed by controllers */
export class VerifySignupOtpDto extends VerifyOtpDto {}
export class VerifyLoginOtpDto extends VerifyOtpDto {}
