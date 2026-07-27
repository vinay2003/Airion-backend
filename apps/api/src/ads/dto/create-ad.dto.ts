import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, IsObject, IsArray, Min } from 'class-validator';
import { AdType } from '../entities/ad.entity';

export class CreateAdDto {
  @IsString()
  campaignName: string;

  @IsOptional()
  @IsString()
  vendorId?: string;

  @IsEnum(AdType)
  adType: AdType;

  @IsOptional()
  @IsObject()
  targetAudience?: Record<string, any>;

  @IsNumber()
  @Min(0)
  dailyBudget: number;

  @IsNumber()
  @Min(0)
  totalBudget: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];
}
