import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

import { CountriesService } from './countries.service';
import { CountryEntity } from './country.entity';

@Resolver('Country')
export class CountriesResolver {
  constructor(private readonly countriesService: CountriesService) {}

  @Query('countries')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<CountryEntity[]> {
    return await this.countriesService.findAll();
  }

  @Query('country')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id') id: number): Promise<CountryEntity> {
    return await this.countriesService.findOne(id);
  }
}
