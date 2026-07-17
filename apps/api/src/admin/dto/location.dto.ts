import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class LocationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
