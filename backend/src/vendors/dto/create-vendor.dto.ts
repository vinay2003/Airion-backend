import { IsString, IsNotEmpty, IsEmail, IsObject, Length, IsUUID, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVendorDto {
    @IsString()
    @IsNotEmpty()
    businessName: string;

    @IsEmail()
    businessEmail: string;

    @IsString()
    businessPhone: string;

    @IsObject()
    businessAddress: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        coordinates?: { lat: number; lng: number };
    };

    @IsString()
    @Length(10, 1000)
    businessDescription: string;

    @IsUUID()
    categoryId: string;

    @IsUUID()
    subcategoryId: string;

    @IsObject()
    businessHours: {
        monday?: { open: string; close: string };
        tuesday?: { open: string; close: string };
        // ... other days
    };

    @IsArray()
    @IsOptional()
    portfolioImages?: string[];

    @IsObject()
    @IsOptional()
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        website?: string;
    };
}
