import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductSeasonsSeeder } from 'src/database/seeds/seeders/product-seasons.seeder';

import { ProductSeasonRepository } from './product-season.repository';
import { ProductSeasonsResolver } from './product-seasons.resolver';
import { ProductSeasonsService } from './product-seasons.service';

@Module({
  providers: [
    ProductSeasonsService,
    ProductSeasonsResolver,
    ProductSeasonsSeeder,
  ],
  imports: [TypeOrmModule.forFeature([ProductSeasonRepository])],
  exports: [ProductSeasonsService, ProductSeasonsSeeder],
})
export class ProductSeasonsModule {}
