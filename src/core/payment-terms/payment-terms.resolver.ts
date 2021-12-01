import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { PaymentTermEntity } from './payment-term.entity';
import { PaymentTermsService } from './payment-terms.service';

@Resolver()
export class PaymentTermsResolver {
  constructor(private paymentTermsService: PaymentTermsService) {}

  @Query('paymentTerms')
  @UseGuards(GqlAuthGuard)
  async findAll(): Promise<PaymentTermEntity[]> {
    return await this.paymentTermsService.findAll();
  }
}
