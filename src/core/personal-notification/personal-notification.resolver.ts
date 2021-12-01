import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';
import { UserEntity } from 'src/core/user/user.entity';

import { PersonalNotificationEntity } from './personal-notification.entity';
import { PersonalNotificationService } from './personal-notification.service';

@Resolver()
export class PersonalNotificationResolver {
  constructor(
    private personalNotificationService: PersonalNotificationService,
  ) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async personalNotifications(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<PersonalNotificationEntity[]> {
    return await this.personalNotificationService.getNotificationList(
      currentUser,
    );
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async setNotificationAsRead(
    @CurrentUser() currentUser: UserEntity,
    @Args('notificationId') notificationId: string,
  ): Promise<PersonalNotificationEntity> {
    return await this.personalNotificationService.setAsRead(
      notificationId,
      currentUser,
    );
  }
}
