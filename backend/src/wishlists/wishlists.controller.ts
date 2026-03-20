import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
    constructor(private readonly wishlistsService: WishlistsService) {}

    /** Toggle a vendor in/out of the wishlist */
    @Post('toggle/:vendorId')
    async toggleWishlist(@Param('vendorId') vendorId: string, @Req() req: any) {
        return this.wishlistsService.toggleWishlist(req.user.id, vendorId);
    }

    /** View all my wishlisted vendors */
    @Get('mine')
    async getMyWishlist(@Req() req: any) {
        return this.wishlistsService.getUserWishlist(req.user.id);
    }

    /** Check if a specific vendor is wishlisted */
    @Get('check/:vendorId')
    async checkIsWishlisted(@Param('vendorId') vendorId: string, @Req() req: any) {
        const isSaved = await this.wishlistsService.checkIsWishlisted(req.user.id, vendorId);
        return { isSaved };
    }
}
