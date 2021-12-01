import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { ProductSeasonEntity } from './product-season.entity';
import { ProductSeasonsService } from './product-seasons.service';

@Resolver()
export class ProductSeasonsResolver {
  constructor(private productSeasonsService: ProductSeasonsService) {}

  @Query('productSeasons')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<ProductSeasonEntity[]> {
    return await this.productSeasonsService.findAll();
  }
}
