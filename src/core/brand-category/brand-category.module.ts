import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrandCategoriesSeeder } from 'src/database/seeds/seeders/brand-categories.seeder';

import { BrandCategoryRepository } from './brand-category.repository';
import { BrandCategoryResolver } from './brand-category.resolver';
import { BrandCategoryService } from './brand-category.service';

@Module({
  providers: [
    BrandCategoryService,
    BrandCategoryResolver,
    BrandCategoriesSeeder,
  ],
  imports: [TypeOrmModule.forFeature([BrandCategoryRepository])],
  exports: [BrandCategoryService, BrandCategoriesSeeder],
})
export class BrandCategoryModule {}
