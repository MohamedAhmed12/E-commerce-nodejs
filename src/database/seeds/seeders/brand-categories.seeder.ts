import { Injectable, OnModuleInit } from '@nestjs/common';

import { BrandCategoryService } from 'src/core/brand-category/brand-category.service';

@Injectable()
export class BrandCategoriesSeeder implements OnModuleInit {
  constructor(private readonly brandCategoryService: BrandCategoryService) {}
  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const genders = ['first category', 'second category', 'third category'];

      genders.forEach(async (gender) => {
        await this.brandCategoryService.create(gender);
      });
    }
  }
}
