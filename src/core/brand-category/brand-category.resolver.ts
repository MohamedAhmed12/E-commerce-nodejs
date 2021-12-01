import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { BrandCategoryEntity } from './brand-category.entity';
import { BrandCategoryService } from './brand-category.service';

@Resolver()
export class BrandCategoryResolver {
  constructor(private brandCategoryService: BrandCategoryService) {}

  @Query('brandCategories')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<BrandCategoryEntity[]> {
    return await this.brandCategoryService.findAll();
  }

  @Query('brandCategory')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id') id: string): Promise<BrandCategoryEntity> {
    return await this.brandCategoryService.findOne(id);
  }
}
