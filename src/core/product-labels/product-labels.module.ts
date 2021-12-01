import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductLabelsSeeder } from 'src/database/seeds/seeders/product-labels.seeder';

import { ProductLabelRepository } from './product-label.repository';
import { ProductLabelsResolver } from './product-labels.resolver';
import { ProductLabelsService } from './product-labels.service';

@Module({
  providers: [ProductLabelsService, ProductLabelsResolver, ProductLabelsSeeder],
  imports: [TypeOrmModule.forFeature([ProductLabelRepository])],
  exports: [ProductLabelsService, ProductLabelsSeeder],
})
export class ProductLabelsModule {}
