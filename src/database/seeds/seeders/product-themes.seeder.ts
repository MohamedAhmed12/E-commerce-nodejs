import { Injectable, OnModuleInit } from '@nestjs/common';

import { ProductThemesService } from 'src/core/product-themes/product-themes.service';

@Injectable()
export class ProductThemesSeeder implements OnModuleInit {
  constructor(private readonly productThemesService: ProductThemesService) {}
  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const themes = ['first theme', 'second theme', 'third theme'];

      themes.forEach(async (theme) => {
        await this.productThemesService.findOrCreate(theme);
      });
    }
  }
}
