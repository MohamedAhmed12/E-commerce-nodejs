import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductColorModule } from '../product-color/product-color.module';

import { ProductImageRepository } from './product-image.repository';
import { ProductImageResolver } from './product-image.resolver';
import { ProductImageService } from './product-image.service';

@Module({
  providers: [ProductImageResolver, ProductImageService],
  imports: [
    ProductColorModule,
    TypeOrmModule.forFeature([ProductImageRepository]),
  ],
})
export class ProductImageModule {}
