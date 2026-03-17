import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Put, NotFoundException, BadRequestException } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivityType } from './entities/activity.entity';

@Controller('vendors')
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createVendorDto: CreateVendorDto, @Request() req: any) {
        return this.vendorsService.create(createVendorDto, req.user);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMyProfile(@Request() req: any) {
        const vendor = await this.vendorsService.findByUserId(req.user.userId);
        return vendor || { message: 'No vendor profile found', isVendor: false };
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: any) {
        const vendor = await this.vendorsService.findOne(id);

        // Track profile view if user is logged in
        if (req.user) {
            await this.vendorsService.trackActivity(req.user.userId, ActivityType.PROFILE_VIEW, id);
        }

        return vendor;
    }

    @Put('me')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Body() updateVendorDto: Partial<CreateVendorDto>, @Request() req: any) {
        const vendor = await this.vendorsService.findByUserId(req.user.userId);

        if (!vendor) {
            throw new NotFoundException('Vendor profile not found');
        }

        return this.vendorsService.update(vendor.id, updateVendorDto, req.user.userId);
    }

    /**
     * Admin Endpoints: Get all vendors with status filter
     */
    @Get()
    @UseGuards(JwtAuthGuard) // Optionally apply AdminGuard if you have one
    async findAll(@Query('status') status?: string) {
        return this.vendorsService.findAll(status);
    }

    /**
     * Admin Endpoint: Update single vendor approval status
     */
    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
        if (!body.status) {
            throw new BadRequestException('Status is required');
        }
        return this.vendorsService.updateStatus(id, body.status);
    }
}
