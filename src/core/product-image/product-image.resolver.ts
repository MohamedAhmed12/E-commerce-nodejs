import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { AddColorVariationToProductImageInput } from 'src/graphql-types';

import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

import { ProductImageEntity } from './product-image.entity';
import { ProductImageService } from './product-image.service';

@Resolver()
export class ProductImageResolver {
  constructor(private readonly productImageService: ProductImageService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async addColorVariationToProductImage(
    @Args('input') input: AddColorVariationToProductImageInput,
  ): Promise<ProductImageEntity> {
    return this.productImageService.addColorVariation(input);
  }
}
