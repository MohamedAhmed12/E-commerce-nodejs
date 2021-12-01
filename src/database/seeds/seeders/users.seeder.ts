import { Injectable, OnModuleInit } from '@nestjs/common';

import { UserService } from 'src/core/user/services/user.service';
import { AbilityType } from 'src/graphql-types';

@Injectable()
export class UsersSeeder implements OnModuleInit {
  constructor(private readonly userService: UserService) {}
  async onModuleInit() {
    return true;
  }

  async run() {
    const isModuleInit = await this.onModuleInit();

    if (isModuleInit) {
      const users = [
        {
          email: 'brandAdmin@maisonpyramide.com',
          firstName: 'brandAdmin',
          lastName: 'brandAdmin',
          abilityType: AbilityType.BRAND_ADMIN,
        },
        {
          email: 'brandCreator@maisonpyramide.com',
          firstName: 'brandCreator',
          lastName: 'brandCreator',
          abilityType: AbilityType.BRAND_CREATOR,
        },
        {
          email: 'retailerBuyer@maisonpyramide.com',
          firstName: 'retailerBuyer',
          lastName: 'retailerBuyer',
          abilityType: AbilityType.RETAILER_BUYER,
        },
      ];

      users.forEach(async (user) => {
        await this.userService.createOrFindSystemUser(user);
      });
    }
  }
}
