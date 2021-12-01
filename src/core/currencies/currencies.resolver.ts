import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { CurrenciesService } from './currencies.service';
import { CurrencyEntity } from './currency.entity';

@Resolver()
export class CurrenciesResolver {
  constructor(private productColorService: CurrenciesService) {}

  @Query('currencies')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<CurrencyEntity[]> {
    return await this.productColorService.findAll();
  }
}
