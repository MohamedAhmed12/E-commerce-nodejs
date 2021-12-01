import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { BrandBadgeEntity } from './brand-badge.entity';
import { BrandBadgesService } from './brand-badges.service';

@Resolver()
export class BrandBadgesResolver {
  constructor(private brandCategoryService: BrandBadgesService) {}

  @Query('BrandBadges')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<BrandBadgeEntity[]> {
    return await this.brandCategoryService.findAll();
  }

  @Query('BrandBadge')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id') id: string): Promise<BrandBadgeEntity> {
    return await this.brandCategoryService.findOne(id);
  }
}
