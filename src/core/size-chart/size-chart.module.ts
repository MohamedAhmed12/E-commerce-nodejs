import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/common/casl/casl.module';
import { ProductSubCategoryModule } from 'src/core/product-sub-category/product-sub-category.module';
import { SizeModule } from 'src/core/size/size.module';

import { SizeChartRepository } from './size-chart.repository';
import { SizeChartResolver } from './size-chart.resolver';
import { SizeChartService } from './size-chart.service';

@Module({
  providers: [SizeChartService, SizeChartResolver],
  imports: [
    ProductSubCategoryModule,
    SizeModule,
    CaslModule,
    TypeOrmModule.forFeature([SizeChartRepository]),
  ],
  exports: [SizeChartService],
})
export class SizeChartModule {}
