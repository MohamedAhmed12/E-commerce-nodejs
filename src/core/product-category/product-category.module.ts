import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductCategoryRepository } from './product-category.repository';
import { ProductCategoryResolver } from './product-category.resolver';
import { ProductCategoryService } from './product-category.service';

@Module({
  providers: [ProductCategoryService, ProductCategoryResolver],
  imports: [TypeOrmModule.forFeature([ProductCategoryRepository])],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
