import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { RSVPStatus } from '../entities/guest.entity';

export class CreateGuestDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    group?: string;

    @IsOptional()
    @IsEnum(RSVPStatus)
    rsvpStatus?: RSVPStatus;
}

export class UpdateGuestDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    group?: string;

    @IsOptional()
    @IsEnum(RSVPStatus)
    rsvpStatus?: RSVPStatus;
}
