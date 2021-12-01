import { Injectable, OnModuleInit } from '@nestjs/common';

import { ProductSeasonsService } from 'src/core/product-seasons/product-seasons.service';

@Injectable()
export class ProductSeasonsSeeder implements OnModuleInit {
  constructor(private readonly productSeasonsService: ProductSeasonsService) {}
  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const seasons = ['first season', 'second season', 'third season'];

      seasons.forEach(async (season) => {
        await this.productSeasonsService.findOrCreate(season);
      });
    }
  }
}
