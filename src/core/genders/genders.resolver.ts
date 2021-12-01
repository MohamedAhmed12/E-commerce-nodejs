import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

import { GenderEntity } from './gender.entity';
import { GendersService } from './genders.service';

@Resolver('Gender')
export class GendersResolver {
  constructor(private readonly gendersService: GendersService) {}

  @Query('genders')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<GenderEntity[]> {
    return await this.gendersService.findAll();
  }

  @Query('gender')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id') id: string): Promise<GenderEntity> {
    return await this.gendersService.findOne(id);
  }
}
