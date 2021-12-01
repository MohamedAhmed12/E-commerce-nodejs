import { Injectable } from '@nestjs/common';

import { ProductCategoryEntity } from '../../src/core/product-category/product-category.entity';
import { ProductCategoryService } from '../../src/core/product-category/product-category.service';

@Injectable()
export class ProductCategoryFactory {
  constructor(private productCategoryService: ProductCategoryService) {}

  async create(name: string): Promise<ProductCategoryEntity> {
    return await this.productCategoryService.create(name);
  }
}
