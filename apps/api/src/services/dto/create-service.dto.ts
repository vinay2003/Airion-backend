import { IsString, IsNotEmpty, IsUUID, Length, IsNumber, Min, Max, IsArray, IsOptional, IsEnum } from 'class-validator';

export class CreateServiceDto {
    @IsUUID()
    @IsOptional()
    vendorId?: string;

    @IsUUID()
    @IsOptional()
    categoryId?: string;

    @IsUUID()
    @IsOptional()
    subcategoryId?: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    basePrice: number;

    @IsString()
    @IsOptional()
    currency: string = 'INR';

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(168) // Up to a week
    durationHours?: number;

    @IsArray()
    @IsOptional()
    images?: string[];

    @IsArray()
    @IsOptional()
    features?: Array<{
        name: string;
        included: boolean;
        description?: string;
    }>;

    @IsString()
    @IsOptional()
    requirements?: string;

    @IsEnum(['onsite', 'remote', 'both'])
    locationType: string;

    @IsArray()
    @IsOptional()
    availableLocations?: string[];

    @IsNumber()
    @Min(1)
    @IsOptional()
    guestCapacity?: number;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsArray()
    @IsOptional()
    packages?: Array<{
        name: string;
        price: number;
        description: string;
        features: any;
        isPopular: boolean;
        deliveryDays?: number;
    }>;
}
