import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

import { CitiesService } from './cities.service';
import { CityEntity } from './city.entity';

@Resolver('City')
export class CitiesResolver {
  constructor(private readonly citiesService: CitiesService) {}

  @Query('cities')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<CityEntity[]> {
    return await this.citiesService.findAll();
  }

  @Query('city')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id') id: number): Promise<CityEntity> {
    return await this.citiesService.findOne(id);
  }
}
