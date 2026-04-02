import { IsEmail, IsString, MinLength, IsPhoneNumber, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class SignupDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsString()
    @MinLength(12, { message: 'Password must be at least 12 characters long' })
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole = UserRole.USER;
}
