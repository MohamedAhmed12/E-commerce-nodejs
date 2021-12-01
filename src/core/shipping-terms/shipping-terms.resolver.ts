import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { ShippingTermEntity } from './shipping-term.entity';
import { ShippingTermsService } from './shipping-terms.service';

@Resolver()
export class ShippingTermsResolver {
  constructor(private shippingTermsService: ShippingTermsService) {}

  @Query('shippingTerms')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<ShippingTermEntity[]> {
    return await this.shippingTermsService.findAll();
  }
}
