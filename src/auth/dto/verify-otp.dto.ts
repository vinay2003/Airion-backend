import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class VerifyOtpDto {
    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    otp: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}
