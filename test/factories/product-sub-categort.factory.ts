import { Injectable } from '@nestjs/common';

import { ProductCategoryEntity } from '../../src/core/product-category/product-category.entity';
import { ProductSubCategoryEntity } from '../../src/core/product-sub-category/product-sub-category.entity';
import { ProductSubCategoryService } from '../../src/core/product-sub-category/product-sub-category.service';

@Injectable()
export class ProductSubCategortFactory {
  constructor(private productSubCategoryService: ProductSubCategoryService) {}

  async create(
    name: string,
    productCategory: ProductCategoryEntity,
  ): Promise<ProductSubCategoryEntity> {
    return await this.productSubCategoryService.create(name, productCategory);
  }
}
