import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { BadgeEntity } from './badge.entity';
import { BadgeService } from './badge.service';

@Resolver()
export class BadgeResolver {
  constructor(private badgeService: BadgeService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async badges(): Promise<BadgeEntity[]> {
    return await this.badgeService.getBadges();
  }
}
