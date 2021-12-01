import { Injectable, OnModuleInit } from '@nestjs/common';

import { GendersService } from 'src/core/genders/genders.service';

@Injectable()
export class GendersSeeder implements OnModuleInit {
  constructor(private readonly gendersService: GendersService) {}
  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const genders = ['Male', 'Female', 'Unisex'];

      genders.forEach(async (gender) => {
        await this.gendersService.create(gender);
      });
    }
  }
}
