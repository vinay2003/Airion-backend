import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto, UpdateGuestDto } from './dto/guest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('guests')
@UseGuards(JwtAuthGuard)
export class GuestsController {
    constructor(private readonly guestsService: GuestsService) {}

    @Get()
    async findAll(@Req() req: any) {
        return this.guestsService.findAll(req.user.userId);
    }

    @Post()
    async create(@Req() req: any, @Body() createGuestDto: CreateGuestDto) {
        return this.guestsService.create(req.user.userId, createGuestDto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Req() req: any, @Body() updateGuestDto: UpdateGuestDto) {
        return this.guestsService.update(id, req.user.userId, updateGuestDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: any) {
        return this.guestsService.remove(id, req.user.userId);
    }
}
