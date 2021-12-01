import { Injectable, OnModuleInit } from '@nestjs/common';

import { BrandKeywordsService } from 'src/core/brand-keywords/brand-keywords.service';
import { BrandService } from 'src/core/brand/brand.service';

@Injectable()
export class BrandKeywordsSeeder implements OnModuleInit {
  constructor(
    private readonly brandKeywordsService: BrandKeywordsService,
    private readonly brandService: BrandService,
  ) {}
  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const brand = await this.brandService.findOneByName('BEHNO');
      const brandKeywords = [
        {
          name: 'first brand keyword',
          brands: [brand],
        },
        {
          name: 'second brand keyword',
          brands: [brand],
        },
        {
          name: 'saas abrand keyword',
          brands: [brand],
        },
      ];
      brandKeywords.forEach(async (brandKeyword) => {
        await this.brandKeywordsService.findOrCreate(brandKeyword);
      });
    }
  }
}
