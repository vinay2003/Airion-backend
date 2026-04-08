import { IsString, IsNotEmpty, IsUUID, Length, IsNumber, Min, Max, IsArray, IsOptional, IsEnum } from 'class-validator';

export class CreateServiceDto {
    @IsUUID()
    vendorId: string;

    @IsUUID()
    categoryId: string;

    @IsUUID()
    subcategoryId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @Length(50, 2000)
    description: string;

    @IsNumber()
    @Min(0)
    basePrice: number;

    @IsString()
    @IsOptional()
    currency: string = 'INR';

    @IsNumber()
    @Min(1)
    @Max(24)
    durationHours: number;

    @IsArray()
    @IsOptional()
    images?: string[];

    @IsArray()
    features: Array<{
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
