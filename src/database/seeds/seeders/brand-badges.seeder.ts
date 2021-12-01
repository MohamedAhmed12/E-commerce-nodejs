import { Injectable, OnModuleInit } from '@nestjs/common';

import { BrandBadgesService } from 'src/core/brand-badges/brand-badges.service';

@Injectable()
export class BrandBadgesSeeder implements OnModuleInit {
  constructor(private readonly brandBadgesService: BrandBadgesService) {}
  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const genders = ['first badge', 'second badge', 'third badge'];

      genders.forEach(async (gender) => {
        await this.brandBadgesService.create(gender);
      });
    }
  }
}
