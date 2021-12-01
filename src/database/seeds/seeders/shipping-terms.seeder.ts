import { Injectable, OnModuleInit } from '@nestjs/common';

import { ShippingTermsService } from 'src/core/shipping-terms/shipping-terms.service';

@Injectable()
export class ShippingTermsSeeder implements OnModuleInit {
  constructor(private readonly shippingTermsService: ShippingTermsService) {}

  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const terms = ['first term', 'second term', 'third term'];

      terms.forEach(async (term) => {
        await this.shippingTermsService.findOrCreate(term);
      });
    }
  }
}
