import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, Put, NotFoundException, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VendorsService } from '../vendors/vendors.service';

@Controller('services')
export class ServicesController {
    constructor(
        private readonly servicesService: ServicesService,
        private readonly vendorsService: VendorsService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createDto: CreateServiceDto, @Request() req: any) {
        // First try to get vendorId from JWT token (fast path)
        let vendorId = req.user.vendorId || createDto.vendorId;

        console.log('[Services] req.user:', JSON.stringify(req.user));
        console.log('[Services] vendorId from token/body:', vendorId);

        // Fallback: if vendorId not in token, look up vendor profile from DB using userId
        if (!vendorId && req.user.sub) {
            const vendor = await this.vendorsService.findByUserId(req.user.sub);
            console.log('[Services] vendor from DB lookup:', vendor?.id ?? 'NOT FOUND');
            vendorId = vendor?.id;
        }

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
    async update(@Param('id') id: string, @Body() updateDto: Partial<CreateServiceDto>, @Request() req: any) {
        return this.servicesService.update(id, updateDto, req.user?.vendorId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string, @Request() req: any) {
        const deleted = await this.servicesService.delete(id, req.user?.vendorId);
        if (!deleted) {
            throw new NotFoundException(`Service not found or could not be deleted`);
        }
    }
}
