import { z } from 'zod';
import { UserRole } from './user';

export const SendOtpSchema = z.object({
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
}).refine(data => data.phone || data.email, {
  message: "Either phone or email must be provided",
  path: ["phone", "email"],
});

/** Base Schema for OTP Verification */
export const VerifyOtpBaseSchema = z.object({
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  otp: z.string().length(6),
});

/** Specialized Signup Verification Schema */
export const VerifySignupOtpSchema = VerifyOtpBaseSchema.extend({
  name: z.string().optional().nullable(),
  password: z.string().min(6).optional().nullable(),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  marketingConsent: z.boolean().default(false).optional(),
});

/** Specialized Login Verification Schema */
export const VerifyLoginOtpSchema = VerifyOtpBaseSchema.extend({
  role: z.nativeEnum(UserRole).optional(),
});

export const LoginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    name: z.string().nullable(),
    role: z.nativeEnum(UserRole),
    avatar: z.string().optional().nullable(),
  }),
  access_token: z.string(),
  refresh_token: z.string().optional(),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  newPassword: z.string().min(6),
});

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(6).optional(),
  newPassword: z.string().min(6),
});

export type SendOtpDto = z.infer<typeof SendOtpSchema>;
export type VerifyOtpBase = z.infer<typeof VerifyOtpBaseSchema>;
export type VerifySignupOtpDto = z.infer<typeof VerifySignupOtpSchema>;
export type VerifyLoginOtpDto = z.infer<typeof VerifyLoginOtpSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
