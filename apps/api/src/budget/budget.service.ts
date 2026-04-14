import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
    constructor(
        @InjectRepository(Budget)
        private budgetRepository: Repository<Budget>,
    ) {}

    async getBudget(userId: string): Promise<Budget> {
        let budget = await this.budgetRepository.findOne({ where: { userId } });
        
        // Auto-create if not exists
        if (!budget) {
            budget = this.budgetRepository.create({
                userId,
                totalBudget: 500000,
                items: [
                    { id: '1', category: 'Venue', allocated: 200000, spent: 0, status: 'pending' },
                    { id: '2', category: 'Catering', allocated: 150000, spent: 0, status: 'pending' },
                    { id: '3', category: 'Photography', allocated: 80000, spent: 0, status: 'pending' },
                    { id: '4', category: 'Decoration', allocated: 50000, spent: 0, status: 'pending' },
                    { id: '5', category: 'Music / DJ', allocated: 20000, spent: 0, status: 'pending' }
                ]
            });
            await this.budgetRepository.save(budget);
        }
        
        return budget;
    }

    async updateBudget(userId: string, updateBudgetDto: UpdateBudgetDto): Promise<Budget> {
        const budget = await this.getBudget(userId);
        
        if (updateBudgetDto.totalBudget !== undefined) {
            budget.totalBudget = updateBudgetDto.totalBudget;
        }
        
        if (updateBudgetDto.items !== undefined) {
            budget.items = updateBudgetDto.items;
        }
        
        return this.budgetRepository.save(budget);
    }
}
