import { IsNumber, IsArray, IsOptional, IsString } from 'class-validator';
import { IBudgetItem } from '../entities/budget.entity';

export class UpdateBudgetDto {
    @IsOptional()
    @IsNumber()
    totalBudget?: number;

    @IsOptional()
    @IsArray()
    items?: IBudgetItem[];
}
