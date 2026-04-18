import { Controller, Get, Post, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budget')
@UseGuards(JwtAuthGuard)
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) {}

    @Get()
    async getBudget(@Req() req: any) {
        return this.budgetService.getBudget(req.user.userId);
    }

    @Patch('update')
    async updateBudget(@Req() req: any, @Body() updateBudgetDto: UpdateBudgetDto) {
        return this.budgetService.updateBudget(req.user.userId, updateBudgetDto);
    }
}
