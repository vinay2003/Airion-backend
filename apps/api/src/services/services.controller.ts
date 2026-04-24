import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, Put, NotFoundException, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createDto: CreateServiceDto, @Request() req: any) {
        // Enforce Vendor ID from Auth Header payload or body. NEVER fallback to userId.
        const vendorId = req.user.vendorId || createDto.vendorId;
        
        if (!vendorId) {
            throw new BadRequestException('Vendor profile not found. Please complete vendor onboarding.');
        }

        // Prevent empty strings from breaking UUID database columns
        if (createDto.categoryId === '') delete (createDto as any).categoryId;
        if (createDto.subcategoryId === '') delete (createDto as any).subcategoryId;

        return this.servicesService.create(createDto, vendorId);
    }

    @Get()
    async findAll(
        @Query('category') category?: string,
        @Query('vendorId') vendorId?: string,
        @Query('search') search?: string,
        @Query('location') location?: string,
        @Query('priceMin') priceMin?: number,
        @Query('priceMax') priceMax?: number,
        @Query('rating') rating?: number,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('sort') sort?: string,
        @Query('order') order?: 'ASC' | 'DESC',
    ) {
        return this.servicesService.findAll({ limit, offset, category, vendorId, search, location, priceMin, priceMax, rating, sort, order });
    }

    @Get(':idOrSlug')
    async findOne(@Param('idOrSlug') idOrSlug: string) {
        return this.servicesService.findOne(idOrSlug);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateDto: Partial<CreateServiceDto>) {
        return this.servicesService.update(id, updateDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        const deleted = await this.servicesService.delete(id);
        if (!deleted) {
            throw new NotFoundException(`Service not found or could not be deleted`);
        }
    }
}
