import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
    Request,
    Query,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { VendorsService } from '../services/vendors.service';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@Controller('vendors')
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createVendorProfile(
        @Request() req,
        @Body() createVendorDto: CreateVendorDto
    ) {
        const vendor = await this.vendorsService.createVendorProfile(req.user.userId, createVendorDto);
        return {
            message: 'Vendor profile created successfully',
            data: vendor,
        };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMyProfile(@Request() req) {
        const vendor = await this.vendorsService.getVendorByUserId(req.user.userId);
        return {
            data: vendor,
        };
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getVendorStats() {
        const stats = await this.vendorsService.getVendorStats();
        return {
            data: stats,
        };
    }

    @Get(':id')
    async getVendorById(@Param('id') id: string) {
        const vendor = await this.vendorsService.getVendorById(id);
        return {
            data: vendor,
        };
    }

    @Get()
    async getAllVendors(
        @Query('city') city?: string,
        @Query('businessType') businessType?: string,
        @Query('isApproved') isApproved?: string,
        @Query('isActive') isActive?: string,
    ) {
        const filters = {
            city,
            businessType,
            isApproved: isApproved ? isApproved === 'true' : undefined,
            isActive: isActive ? isActive === 'true' : undefined,
        };

        const vendors = await this.vendorsService.getAllVendors(filters);
        return {
            data: vendors,
            count: vendors.length,
        };
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateVendor(
        @Param('id') id: string,
        @Request() req,
        @Body() updateVendorDto: UpdateVendorDto
    ) {
        const vendor = await this.vendorsService.updateVendor(id, req.user.userId, updateVendorDto);
        return {
            message: 'Vendor profile updated successfully',
            data: vendor,
        };
    }

    @Post(':id/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    async approveVendor(@Param('id') id: string) {
        const vendor = await this.vendorsService.approveVendor(id);
        return {
            message: 'Vendor approved successfully',
            data: vendor,
        };
    }

    @Post(':id/deactivate')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    async deactivateVendor(@Param('id') id: string) {
        const vendor = await this.vendorsService.deactivateVendor(id);
        return {
            message: 'Vendor deactivated successfully',
            data: vendor,
        };
    }
}
