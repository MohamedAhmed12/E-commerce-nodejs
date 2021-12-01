import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductColorRepository } from './product-color.repository';
import { ProductColorResolver } from './product-color.resolver';
import { ProductColorService } from './product-color.service';

@Module({
  providers: [ProductColorService, ProductColorResolver],
  imports: [TypeOrmModule.forFeature([ProductColorRepository])],
  exports: [ProductColorService],
})
export class ProductColorModule {}
