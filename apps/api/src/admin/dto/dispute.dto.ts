import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class DisputeDto {
    @IsString()
    @IsNotEmpty()
    resolution: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    refundAmount?: number;
}
