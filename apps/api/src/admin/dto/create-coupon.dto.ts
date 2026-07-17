import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsEnum, Min } from 'class-validator';

export class CreateCouponDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsEnum(['percentage', 'fixed'])
    type: 'percentage' | 'fixed';

    @IsNumber()
    @Min(0)
    value: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    usageLimit?: number;

    @IsDateString()
    expiryDate: string;

    @IsOptional()
    @IsString()
    applicableTo?: string;

    @IsOptional()
    @IsEnum(['Active', 'Expired', 'Depleted'])
    status?: string;
}
