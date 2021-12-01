import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { ProductMaterialEntity } from './product-material.entity';
import { ProductMaterialsService } from './product-materials.service';

@Resolver()
export class ProductMaterialsResolver {
  constructor(private productMaterialsService: ProductMaterialsService) {}

  @Query('productMaterials')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<ProductMaterialEntity[]> {
    return await this.productMaterialsService.findAll();
  }
}
