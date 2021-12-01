import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { ProductThemeEntity } from './product-theme.entity';
import { ProductThemesService } from './product-themes.service';

@Resolver()
export class ProductThemesResolver {
  constructor(private productThemesService: ProductThemesService) {}

  @Query('productThemes')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<ProductThemeEntity[]> {
    return await this.productThemesService.findAll();
  }
}
