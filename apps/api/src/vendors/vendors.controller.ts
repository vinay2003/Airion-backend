import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Put, NotFoundException, BadRequestException } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
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
        try {
            // Guard against unauthorized or malformed data
            if (!req || !req.user) return null;

            // Normalize UserId (some payloads use .sub, others use .userId)
            const userId = req.user.userId || (req.user as any).sub;
            if (!userId) {
                console.warn('[VendorsController] User authenticated but no ID found in payload');
                return null;
            }

            const vendor = await this.vendorsService.findByUserId(userId);
            return vendor || null;
        } catch (error) {
            console.error('[VendorsController] Failed to resolve vendor profile:', error);
            // We return null to maintain stable UX even on unexpected internal errors
            return null;
        }
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findAll(@Query('status') status?: string) {
        return this.vendorsService.findAll(status);
    }

    /**
     * Admin Endpoint: Update single vendor approval status
     */
    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
        if (!body.status) {
            throw new BadRequestException('Status is required');
        }
        return this.vendorsService.updateStatus(id, body.status);
    }

    @Get(':id/stats/bookings')
    @UseGuards(JwtAuthGuard)
    async getStats(@Param('id') id: string) {
        return this.vendorsService.getVendorStats(id);
    }

    @Get(':id/earnings')
    @UseGuards(JwtAuthGuard)
    async getEarnings(@Param('id') id: string) {
        return this.vendorsService.getDetailedEarnings(id);
    }

    // --- ADS ENDPOINTS ---

    @Post('ads')
    @UseGuards(JwtAuthGuard)
    async createAd(@Request() req: any, @Body() adData: any) {
        return this.vendorsService.createAd(req.user.userId, adData);
    }

    @Put('ads/:adId')
    @UseGuards(JwtAuthGuard)
    async updateAd(@Request() req: any, @Param('adId') adId: string, @Body() updateData: any) {
        return this.vendorsService.updateAd(req.user.userId, adId, updateData);
    }

    // --- GALLERY ENDPOINTS ---

    @Post('gallery')
    @UseGuards(JwtAuthGuard)
    async addToGallery(@Request() req: any, @Body() item: any) {
        return this.vendorsService.addToGallery(req.user.userId, item);
    }

    @Delete('gallery/:itemId')
    @UseGuards(JwtAuthGuard)
    async removeFromGallery(@Request() req: any, @Param('itemId') itemId: string) {
        return this.vendorsService.removeFromGallery(req.user.userId, itemId);
    }
}
