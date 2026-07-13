import { PartialType } from '@nestjs/mapped-types';
import { CreateAdDto } from './create-ad.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { AdStatus } from '../entities/ad.entity';

export class UpdateAdDto extends PartialType(CreateAdDto) {
    @IsOptional()
    @IsEnum(AdStatus)
    status?: AdStatus;
}
