import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { ProductLabelEntity } from './product-label.entity';
import { ProductLabelsService } from './product-labels.service';

@Resolver()
export class ProductLabelsResolver {
  constructor(private productLabelsService: ProductLabelsService) {}

  @Query('productLabels')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<ProductLabelEntity[]> {
    return await this.productLabelsService.findAll();
  }
}
