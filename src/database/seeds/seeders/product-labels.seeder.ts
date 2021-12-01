import { Injectable, OnModuleInit } from '@nestjs/common';

import { ProductLabelsService } from 'src/core/product-labels/product-labels.service';

@Injectable()
export class ProductLabelsSeeder implements OnModuleInit {
  constructor(private readonly productLabelsService: ProductLabelsService) {}
  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const labels = ['first label', 'second label', 'third label'];

      labels.forEach(async (label) => {
        await this.productLabelsService.findOrCreate(label);
      });
    }
  }
}
