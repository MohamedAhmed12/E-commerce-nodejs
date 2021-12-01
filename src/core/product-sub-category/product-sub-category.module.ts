import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductSubCategoryRepository } from './product-sub-category.repository';
import { ProductSubCategoryResolver } from './product-sub-category.resolver';
import { ProductSubCategoryService } from './product-sub-category.service';

@Module({
  providers: [ProductSubCategoryService, ProductSubCategoryResolver],
  imports: [TypeOrmModule.forFeature([ProductSubCategoryRepository])],
  exports: [ProductSubCategoryService],
})
export class ProductSubCategoryModule {}
