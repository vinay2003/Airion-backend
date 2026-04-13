import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    async findAll(@Query('role') role?: string) {
        console.log(`🔍 [DEBUG] Admin Users Fetch Triggered (Role: ${role || 'All'})`);
        const users = await this.authService.findAllUsers(role);
        console.log(`🔍 [DEBUG] Found ${users?.length || 0} users in DB`);
        return users;
    }
}
