import { createZodDto } from 'nestjs-zod';
import { 
  SendOtpSchema, 
  VerifyOtpBaseSchema,
  VerifySignupOtpSchema,
  VerifyLoginOtpSchema,
  ResetPasswordSchema,
  ChangePasswordSchema
} from '@ease2event/types';

export class SendOtpDto extends createZodDto(SendOtpSchema) {}

/** 
 * Base DTO for OTP verification.
 * Note: We don't redeclare properties here; nestjs-zod handles inference.
 */
export class VerifyOtpDto extends createZodDto(VerifyOtpBaseSchema) {}

/** 
 * Specialized Signup DTO.
 * Extends base schema logic without property shadowing.
 */
export class VerifySignupOtpDto extends createZodDto(VerifySignupOtpSchema) {}

/** 
 * Specialized Login DTO.
 */
export class VerifyLoginOtpDto extends createZodDto(VerifyLoginOtpSchema) {}

/**
 * Reset Password DTO.
 */
export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}

/**
 * Change Password DTO.
 */
export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}
