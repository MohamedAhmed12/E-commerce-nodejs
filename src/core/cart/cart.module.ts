import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartRepository } from './cart.repository';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';

@Module({
  providers: [CartResolver, CartService],
  imports: [TypeOrmModule.forFeature([CartRepository])],
  exports: [CartService],
})
export class CartModule {}
