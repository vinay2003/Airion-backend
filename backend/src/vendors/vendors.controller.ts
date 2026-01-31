import { Controller, Get, Post, Body, Put, UseGuards, Request, Param, NotFoundException } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
    findOne(@Param('id') id: string) {
        return this.vendorsService.findOne(id);
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
}
