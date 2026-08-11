import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductWishlist } from './entities/product-wishlist.entity';
import { MerchandiseService } from './merchandise.service';
import { MerchandiseController } from './merchandise.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Order, OrderItem, ProductWishlist]),
    ],
    controllers: [MerchandiseController],
    providers: [MerchandiseService],
    exports: [MerchandiseService],
})
export class MerchandiseModule {}
