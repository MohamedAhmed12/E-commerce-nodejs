import { Injectable } from '@nestjs/common';

import { ProductSubCategoryEntity } from '../../src/core/product-sub-category/product-sub-category.entity';
import { SizeChartEntity } from '../../src/core/size-chart/size-chart.entity';
import { SizeChartService } from '../../src/core/size-chart/size-chart.service';

@Injectable()
export class SizeChartFactory {
  constructor(private sizeChartService: SizeChartService) {}

  async create(
    name: string,
    subCategory: ProductSubCategoryEntity,
  ): Promise<SizeChartEntity> {
    return await this.sizeChartService.create(name, subCategory);
  }
}
