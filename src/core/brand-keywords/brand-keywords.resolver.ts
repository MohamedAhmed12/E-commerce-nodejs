import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { BrandKeywordEntity } from './brand-keyword.entity';
import { BrandKeywordsService } from './brand-keywords.service';

@Resolver()
export class BrandKeywordsResolver {
  constructor(private brandKeywordsService: BrandKeywordsService) {}

  @Query('brandKeywords')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<BrandKeywordEntity[]> {
    return await this.brandKeywordsService.findAll();
  }

  @Query('brandKeyword')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('name') name: string): Promise<BrandKeywordEntity> {
    return await this.brandKeywordsService.findOneByName(name);
  }
}
