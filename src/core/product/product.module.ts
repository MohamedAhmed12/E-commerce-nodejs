import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/common/casl/casl.module';
import { S3Module } from 'src/common/s3/s3.module';
import { BrandModule } from 'src/core/brand/brand.module';
import { LinesheetModule } from 'src/core/linesheet/linesheet.module';
import { ProductColorModule } from 'src/core/product-color/product-color.module';
import { ProductImageModule } from 'src/core/product-image/product-image.module';
import { ProductSubCategoryModule } from 'src/core/product-sub-category/product-sub-category.module';
import { SizeChartModule } from 'src/core/size-chart/size-chart.module';
import { SizeModule } from 'src/core/size/size.module';

import { ProductRepository } from './product.repository';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { BigNumberScalar } from './scalars/big-number.scalar';

@Module({
  providers: [ProductResolver, ProductService, BigNumberScalar],
  imports: [
    BrandModule,
    LinesheetModule,
    ProductColorModule,
    ProductSubCategoryModule,
    SizeChartModule,
    SizeModule,
    CaslModule,
    S3Module,
    ProductImageModule,
    TypeOrmModule.forFeature([ProductRepository]),
  ],
  exports: [ProductService],
})
export class ProductModule {}
