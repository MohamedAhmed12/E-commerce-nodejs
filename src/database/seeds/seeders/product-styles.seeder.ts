import { Injectable, OnModuleInit } from '@nestjs/common';

import { ProductStylesService } from 'src/core/product-styles/product-styles.service';
import { ProductSubCategoryService } from 'src/core/product-sub-category/product-sub-category.service';

@Injectable()
export class ProductStylesSeeder implements OnModuleInit {
  constructor(
    private readonly productStylesService: ProductStylesService,
    private readonly productSubCategoryService: ProductSubCategoryService,
  ) {}
  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const productSubCategory =
        await this.productSubCategoryService.findOneByName('activewear');
      const styles = ['first style', 'second style', 'third style'];

      if (productSubCategory) {
        styles.forEach(async (style) => {
          await this.productStylesService.findOrCreate(
            style,
            productSubCategory,
          );
        });
      }
    }
  }
}
