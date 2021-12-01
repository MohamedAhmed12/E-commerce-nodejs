import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductStylesSeeder } from 'src/database/seeds/seeders/product-styles.seeder';

import { ProductSubCategoryModule } from '../product-sub-category/product-sub-category.module';

import { ProductStyleRepository } from './product-style.repository';
import { ProductStylesResolver } from './product-styles.resolver';
import { ProductStylesService } from './product-styles.service';

@Module({
  providers: [ProductStylesService, ProductStylesResolver, ProductStylesSeeder],
  imports: [
    TypeOrmModule.forFeature([ProductStyleRepository]),
    ProductSubCategoryModule,
  ],
  exports: [ProductStylesService, ProductStylesSeeder],
})
export class ProductStylesModule {}
