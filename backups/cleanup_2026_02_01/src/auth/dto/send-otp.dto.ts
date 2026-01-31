import { IsMobilePhone, IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class SendOtpDto {
    @IsString()
    @IsNotEmpty()
    // @IsMobilePhone('en-IN') // Strict validation can be enabled later
    phone: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}
