import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, HttpCode, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() body: { bookingId: string; rating: number; reviewText?: string; images?: string[] }, @Request() req: any) {
        if (!body.bookingId || !body.rating) {
            throw new BadRequestException('Booking ID and Rating are required');
        }

        if (body.rating < 1 || body.rating > 5) {
             throw new BadRequestException('Rating must be between 1 and 5');
        }

        return this.reviewsService.create(req.user.userId, body);
    }

    @Get('service/:serviceId')
    async findByService(@Param('serviceId') serviceId: string) {
        return this.reviewsService.findByService(serviceId);
    }

    @Get('vendor/:vendorId')
    async findByVendor(@Param('vendorId') vendorId: string) {
        return this.reviewsService.findByVendor(vendorId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string, @Request() req: any) {
        const deleted = await this.reviewsService.delete(id, req.user.userId);
        if (!deleted) {
            throw new NotFoundException(`Review could not be deleted`);
        }
    }
}
