import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { DisputeDto } from './dto/dispute.dto';
import { CategoryDto } from './dto/category.dto';
import { LocationDto } from './dto/location.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('dashboard')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)
    async getDashboard() {
        const data = await this.adminService.getDashboardStats();
        return { data };
    }

    @Get('disputes')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT)
    async getDisputes(@Query('status') status?: string) {
        const data = await this.adminService.getDisputes(status);
        return { data };
    }

    @Post('disputes/:id/resolve')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT)
    async resolve(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: DisputeDto
    ) {
        const data = await this.adminService.resolveDispute(id, body.resolution, body.refundAmount, req.user.userId);
        return { success: true, message: 'Dispute resolved', data };
    }

    @Post('disputes/raise')
    async raise(@Request() req: any, @Body() body: DisputeDto & { bookingId: string, reason: string }) {
        const data = await this.adminService.createDispute({
            bookingId: body.bookingId,
            raisedById: req.user.userId,
            reason: body.reason
        });
        return { success: true, message: 'Dispute raised', data };
    }

    @Get('users')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async getUsers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('status') status?: string,
        @Query('sort') sort?: string,
    ) {
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 20;
        const { data, meta } = await this.adminService.getUsers(pageNum, limitNum, search, status, sort);
        return {
            data,
            pagination: { page: pageNum, limit: limitNum, total: meta.total, totalPages: Math.ceil(meta.total / limitNum) }
        };
    }

    @Get('users/:id')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async getUserDetails(@Param('id') id: string) {
        const data = await this.adminService.getUserDetails(id);
        return { data };
    }

    @Patch('users/:id/block')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async blockUser(@Request() req: any, @Param('id') id: string) {
        const data = await this.adminService.blockUser(id, req.user.userId);
        return { success: true, message: 'User blocked', data };
    }

    @Patch('users/:id/unblock')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async unblockUser(@Request() req: any, @Param('id') id: string) {
        const data = await this.adminService.unblockUser(id, req.user.userId);
        return { success: true, message: 'User unblocked', data };
    }

    @Get('vendors')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async getVendors(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('status') status?: string,
        @Query('category') category?: string,
    ) {
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 20;
        const { data, meta } = await this.adminService.getVendors(pageNum, limitNum, search, status, category);
        return {
            data,
            pagination: { page: pageNum, limit: limitNum, total: meta.total, totalPages: Math.ceil(meta.total / limitNum) }
        };
    }

    @Get('vendors/:id')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async getVendorDetails(@Param('id') id: string) {
        const data = await this.adminService.getVendorDetails(id);
        return { data };
    }

    // --- Phase 5: Reports Integration ---

    @Get('reports')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)
    async getReports(@Query('timeRange') timeRange?: string) {
        const data = await this.adminService.getReports(timeRange);
        return { data };
    }

    // --- Phase 6: Bookings Integration ---
    @Get('bookings')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT)
    async getBookings(@Query('page') page: string = '1', @Query('limit') limit: string = '50') {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const { data, total } = await this.adminService.getBookings(pageNum, limitNum);
        return {
            data,
            pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) }
        };
    }

    @Patch('bookings/:id/status')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT)
    async updateBookingStatus(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: UpdateStatusDto
    ) {
        const data = await this.adminService.updateBookingStatus(id, body.status, req.user.userId);
        return { success: true, message: 'Status updated', data };
    }

    // --- Phase 7: Support Tickets Integration ---
    @Get('tickets')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT)
    async getTickets() {
        const data = await this.adminService.getTickets();
        return { data };
    }

    @Patch('tickets/:id/status')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT)
    async updateTicketStatus(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: UpdateStatusDto
    ) {
        const data = await this.adminService.updateTicketStatus(id, body.status, req.user.userId);
        return { success: true, message: 'Ticket status updated', data };
    }

    @Post('tickets/:id/reply')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT)
    async replyToTicket(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: ReplyTicketDto
    ) {
        const data = await this.adminService.replyToTicket(id, body.reply, req.user.userId);
        return { success: true, message: 'Reply sent', data };
    }

    // --- Phase 8: Advertisements Integration ---
    @Get('advertisements')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async getAdvertisements() {
        const data = await this.adminService.getAdvertisements();
        return { data };
    }

    @Post('advertisements')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async createAdvertisement(@Request() req: any, @Body() body: any) {
        const data = await this.adminService.createAdvertisement(body, req.user.userId);
        return { success: true, message: 'Advertisement created', data };
    }

    @Patch('advertisements/:id/status')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async updateAdvertisementStatus(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: UpdateStatusDto
    ) {
        const data = await this.adminService.updateAdvertisementStatus(id, body.status, req.user.userId);
        return { success: true, message: 'Advertisement updated', data };
    }

    // --- Phase 9: Coupons Integration ---
    @Get('coupons')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)
    async getCoupons() {
        const data = await this.adminService.getCoupons();
        return { data };
    }

    @Post('coupons')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)
    async createCoupon(@Request() req: any, @Body() data: CreateCouponDto) {
        const result = await this.adminService.createCoupon(data, req.user.userId);
        return { success: true, message: 'Coupon created', data: result };
    }

    @Delete('coupons/:id')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)
    async deleteCoupon(@Request() req: any, @Param('id') id: string) {
        await this.adminService.deleteCoupon(id, req.user.userId);
        return { success: true, message: 'Coupon deleted' };
    }

    // --- Categories ---

    @Get('categories')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async getCategories() {
        const data = await this.adminService.getCategories();
        return { data };
    }

    @Post('categories')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async createCategory(@Request() req: any, @Body() body: CategoryDto) {
        const data = await this.adminService.createCategory(body, req.user.userId);
        return { success: true, message: 'Category created', data };
    }

    @Patch('categories/:id')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async updateCategory(@Request() req: any, @Param('id') id: string, @Body() body: CategoryDto) {
        const data = await this.adminService.updateCategory(id, body, req.user.userId);
        return { success: true, message: 'Category updated', data };
    }

    @Post('categories/:id/delete') // Note: Post for delete to bypass strict delete bodies if any
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async deleteCategory(@Request() req: any, @Param('id') id: string) {
        await this.adminService.deleteCategory(id, req.user.userId);
        return { success: true, message: 'Category deleted' };
    }

    // --- Locations ---

    @Get('locations')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async getLocations() {
        const data = await this.adminService.getLocations();
        return { data };
    }

    @Post('locations')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async createLocation(@Request() req: any, @Body() body: LocationDto) {
        const data = await this.adminService.createLocation(body, req.user.userId);
        return { success: true, message: 'Location created', data };
    }

    @Patch('locations/:id')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async updateLocation(@Request() req: any, @Param('id') id: string, @Body() body: LocationDto) {
        const data = await this.adminService.updateLocation(id, body, req.user.userId);
        return { success: true, message: 'Location updated', data };
    }

    @Post('locations/:id/delete')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async deleteLocation(@Request() req: any, @Param('id') id: string) {
        await this.adminService.deleteLocation(id, req.user.userId);
        return { success: true, message: 'Location deleted' };
    }

    @Post('vendors/:id/verify')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async verifyVendor(@Request() req: any, @Param('id') id: string, @Body() body: UpdateStatusDto) {
        const data = await this.adminService.updateVendorStatus(id, body.status as 'approved' | 'rejected', req.user.userId);
        return { success: true, message: 'Vendor status updated', data };
    }

    @Post('vendors/:id/suspend')
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
    async suspendVendor(@Request() req: any, @Param('id') id: string) {
        const data = await this.adminService.suspendVendor(id, req.user.userId);
        return { success: true, message: 'Vendor suspended', data };
    }
}
