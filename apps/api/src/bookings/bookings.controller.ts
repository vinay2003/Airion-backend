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
            userId: req.user.userId, // Current authenticated user (fixed from req.user.id)
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
        return this.bookingsService.findAllByUserId(req.user.userId);
    }

    /**
     * Fetch bookings assigned to the logged-in user (Vendor)
     */
    @Get('vendor')
    async getVendorBookings(@Req() req: any) {
        if (req.user.role !== 'vendor') {
             throw new BadRequestException('Access denied: You are not a vendor');
        }
        // Service will find vendorId from userId internally or we pass userId
        return this.bookingsService.findAllByVendorUserId(req.user.userId);
    }

    /**
     * Get single booking details
     */
    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: any) {
        return this.bookingsService.findOne(id, req.user);
    }

    /**
     * Update booking status (e.g., cancelled, in-progress)
     */
    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() body: { status: 'pending' | 'confirmed' | 'completed' | 'canceled'; paymentId?: string; paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded' }, @Req() req: any) {
        if (!body.status) {
            throw new BadRequestException('Status is required');
        }
        const updated = await this.bookingsService.transitionState(id, body.status, req.user, body.paymentId, body.paymentStatus);
        return { success: true, booking: updated };
    }

    @Get(':id/invoice')
    async getInvoice(@Param('id') id: string, @Req() req: any) {
        const booking = await this.bookingsService.findOne(id, req.user);
        return {
            invoiceId: `INV-${booking.id.substring(0, 8)}`,
            date: new Date().toISOString(),
            amount: booking.totalAmount,
            vendor: booking.vendor?.businessName,
            status: booking.status,
            customer: req.user.name,
        };
    }
}
