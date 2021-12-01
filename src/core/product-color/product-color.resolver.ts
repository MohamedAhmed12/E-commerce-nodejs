import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { ProductColorEntity } from './product-color.entity';
import { ProductColorService } from './product-color.service';

@Resolver()
export class ProductColorResolver {
  constructor(private productColorService: ProductColorService) {}

  @Query('productColors')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<ProductColorEntity[]> {
    return await this.productColorService.findAll();
  }
}
