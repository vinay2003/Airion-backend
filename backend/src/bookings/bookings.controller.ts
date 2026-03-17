import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard) // Require login for all booking actions
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    /**
     * Create a new booking
     */
    @Post()
    async create(@Body() body: { vendorId: string; serviceId?: string; packageId?: string; totalAmount: number; eventDate: string; specialRequirements?: string }, @Req() req: any) {
        if (!body.vendorId || !body.totalAmount) {
            throw new BadRequestException('Vendor and Amount are required');
        }

        const booking = await this.bookingsService.create({
            userId: req.user.id, // Current authenticated user
            vendorId: body.vendorId,
            serviceId: body.serviceId,
            packageId: body.packageId,
            totalAmount: body.totalAmount,
            eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
            specialRequirements: body.specialRequirements,
            bookingDate: new Date(),
            currency: 'INR',
        });

        return { success: true, booking };
    }

    /**
     * Fetch bookings made by the logged-in user (Customer)
     */
    @Get('mine')
    async getMyBookings(@Req() req: any) {
        return this.bookingsService.findAllByUserId(req.user.id);
    }

    /**
     * Fetch bookings assigned to the logged-in user (Vendor)
     */
    @Get('vendor')
    async getVendorBookings(@Req() req: any) {
        // Assume req.user has a vendorId attached if they are a vendor during login payload enrichment
        // Or fetch their vendor record from the db first. Let's look for vendorId in payload
        if (!req.user.vendorId) {
             throw new BadRequestException('This user is not registered as a vendor');
        }
        return this.bookingsService.findAllByVendorId(req.user.vendorId);
    }

    /**
     * Get single booking details
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    /**
     * Update booking status (e.g., cancelled, in-progress)
     */
    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() body: { status: string; paymentId?: string }) {
        if (!body.status) {
            throw new BadRequestException('Status is required');
        }
        const updated = await this.bookingsService.updateStatus(id, body.status, body.paymentId);
        return { success: true, booking: updated };
    }
}
