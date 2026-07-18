import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartItemType } from './entities/cart-item.entity';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    getCart(@Request() req: any) {
        return this.cartService.getCart(req.user.id);
    }

    @Post('items')
    addItem(
        @Request() req: any,
        @Body() dto: { itemType: CartItemType; referenceId: string; quantity?: number; metadata?: any }
    ) {
        return this.cartService.addItem(req.user.id, dto);
    }

    @Put('items/:id')
    updateItem(
        @Request() req: any,
        @Param('id') itemId: string,
        @Body() dto: { quantity: number }
    ) {
        return this.cartService.updateItemQuantity(req.user.id, itemId, dto.quantity);
    }

    @Delete('items/:id')
    removeItem(
        @Request() req: any,
        @Param('id') itemId: string
    ) {
        return this.cartService.removeItem(req.user.id, itemId);
    }

    @Delete()
    clearCart(@Request() req: any) {
        return this.cartService.clearCart(req.user.id);
    }

    @Post('merge')
    mergeCart(
        @Request() req: any,
        @Body() dto: { items: { itemType: CartItemType; referenceId: string; quantity: number; metadata: any }[] }
    ) {
        return this.cartService.mergeCart(req.user.id, dto.items);
    }
}
