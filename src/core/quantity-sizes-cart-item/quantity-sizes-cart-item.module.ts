import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SizeModule } from 'src/core/size/size.module';

import { QuantitySizesCartItemRepository } from './quantity-sizes-cart-item.repository';
import { QuantitySizesCartItemService } from './quantity-sizes-cart-item.service';

@Module({
  providers: [QuantitySizesCartItemService],
  imports: [
    SizeModule,
    TypeOrmModule.forFeature([QuantitySizesCartItemRepository]),
  ],
  exports: [QuantitySizesCartItemService],
})
export class QuantitySizesCartItemModule {}
