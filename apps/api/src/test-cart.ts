import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CartService } from './cart/cart.service';
import { CartItemType } from './cart/entities/cart-item.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cartService = app.get(CartService);

  try {
    const userId = '92a4b1cc-4d46-4154-8de7-6dbc7eb38bf8'; // rishabr126@gmail.com
    console.log('Adding item to cart...');
    const cart = await cartService.addItem(userId, {
        itemType: CartItemType.MERCHANDISE,
        referenceId: 'm1',
        quantity: 1,
        metadata: { test: true }
    });
    console.log('Success:', cart);
  } catch (error) {
    console.error('Error adding item:', error);
  }

  await app.close();
}
bootstrap();
