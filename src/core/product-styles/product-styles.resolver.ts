import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { ProductStyleEntity } from './product-style.entity';
import { ProductStylesService } from './product-styles.service';

@Resolver()
export class ProductStylesResolver {
  constructor(private productSubCategoryService: ProductStylesService) {}

  @Query('productStyles')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<ProductStyleEntity[]> {
    return await this.productSubCategoryService.findAll();
  }
}
