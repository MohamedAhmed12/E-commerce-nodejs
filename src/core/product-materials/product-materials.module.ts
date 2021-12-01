import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductCategoryModule } from '../product-category/product-category.module';

import { ProductMaterialRepository } from './product-material.repository';
import { ProductMaterialsResolver } from './product-materials.resolver';
import { ProductMaterialsService } from './product-materials.service';

@Module({
  providers: [ProductMaterialsService, ProductMaterialsResolver],
  imports: [
    TypeOrmModule.forFeature([ProductMaterialRepository]),
    ProductCategoryModule,
  ],
  exports: [ProductMaterialsService],
})
export class ProductMaterialsModule {}
