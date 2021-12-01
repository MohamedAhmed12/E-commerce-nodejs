import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { ProductCategoryEntity } from './product-category.entity';
import { ProductCategoryService } from './product-category.service';

@Resolver()
export class ProductCategoryResolver {
  constructor(private productCategoryService: ProductCategoryService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async productCategories(): Promise<ProductCategoryEntity[]> {
    return await this.productCategoryService.getProductCategories();
  }

  @Query('productCategory')
  @UseGuards(GqlAuthGuard)
  async find(@Args('id') id: string): Promise<ProductCategoryEntity> {
    return await this.productCategoryService.findOne(id);
  }
}
