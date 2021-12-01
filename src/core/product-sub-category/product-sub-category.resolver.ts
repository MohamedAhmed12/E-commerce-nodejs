import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { ProductSubCategoryEntity } from './product-sub-category.entity';
import { ProductSubCategoryService } from './product-sub-category.service';

@Resolver()
export class ProductSubCategoryResolver {
  constructor(private productSubCategoryService: ProductSubCategoryService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async productSubCategories(): Promise<ProductSubCategoryEntity[]> {
    return await this.productSubCategoryService.getProductSubCategories();
  }
}
