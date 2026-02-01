import { IsString, IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class SendOtpDto {
    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}

export class VerifySignupOtpDto {
    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(6)
    otp: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole = UserRole.USER;
}

export class VerifyLoginOtpDto {
    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(6)
    otp: string;
}

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    token: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}
