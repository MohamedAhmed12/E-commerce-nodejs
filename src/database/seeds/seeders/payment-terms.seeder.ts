import { Injectable, OnModuleInit } from '@nestjs/common';

import { PaymentTermsService } from 'src/core/payment-terms/payment-terms.service';

@Injectable()
export class PaymentTermsSeeder implements OnModuleInit {
  constructor(private readonly shippingTermsService: PaymentTermsService) {}
  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const paymentTerms = [
        'first payment term',
        'second payment term',
        'third payment term',
      ];

      paymentTerms.forEach(async (paymentTerm) => {
        await this.shippingTermsService.findOrCreate(paymentTerm);
      });
    }
  }
}
