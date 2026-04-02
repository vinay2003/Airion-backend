import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, NotFoundException, BadRequestException } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) {}

    @Post()
    async create(@Body() body: { vendorId: string; serviceId?: string; eventDate: string; guestsCount?: number; budget?: number; notes?: string }, @Request() req: any) {
        if (!body.vendorId || !body.eventDate) {
            throw new BadRequestException('Vendor ID and Event Date are required');
        }

        return this.leadsService.create(req.user.userId, body); // Fixed req.user.id to req.user.userId
    }

    @Get('vendor')
    async findByVendor(@Request() req: any) {
        if (req.user.role !== 'vendor') {
             throw new BadRequestException('Log in as vendor to view leads profile');
        }
        return this.leadsService.findByVendorUserId(req.user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: any) {
        return this.leadsService.findOne(id, req.user);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Request() req: any) {
        if (!body.status) {
             throw new BadRequestException('Status is required');
        }
        return this.leadsService.updateStatus(id, body.status, req.user);
    }
}
