import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';
import { UserEntity } from 'src/core/user/user.entity';

import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';

@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async notifications(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<NotificationEntity[]> {
    return await this.notificationService.getNotificationList(currentUser);
  }
}
