import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/common/casl/casl.module';
import { CartModule } from 'src/core/cart/cart.module';
import { ProductModule } from 'src/core/product/product.module';
import { QuantitySizesCartItemModule } from 'src/core/quantity-sizes-cart-item/quantity-sizes-cart-item.module';

import { CartItemRepository } from './cart-item.repository';
import { CartItemResolver } from './cart-item.resolver';
import { CartItemService } from './cart-item.service';

@Module({
  providers: [CartItemResolver, CartItemService],
  imports: [
    ProductModule,
    CartModule,
    QuantitySizesCartItemModule,
    CaslModule,
    TypeOrmModule.forFeature([CartItemRepository]),
  ],
  exports: [CartItemService],
})
export class CartItemModule {}
