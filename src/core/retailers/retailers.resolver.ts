import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

import { RetailersService } from './retailers.service';

@Resolver('Retailer')
export class RetailersResolver {
  constructor(private readonly retailersService: RetailersService) {}

  @Query('retailers')
  @UseGuards(GqlAuthGuard)
  async findAll() {
    return await this.retailersService.findAll();
  }

  @Query('retailer')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id') id: number) {
    return await this.retailersService.findOne(id);
  }
}
