import { Injectable } from '@nestjs/common';

import { NotificationEntity } from '../../src/core/notification/notification.entity';
import { PersonalNotificationEntity } from '../../src/core/personal-notification/personal-notification.entity';
import { PersonalNotificationService } from '../../src/core/personal-notification/personal-notification.service';
import { UserEntity } from '../../src/core/user/user.entity';

@Injectable()
export class PersonalNotificationFactory {
  constructor(
    private personalNotificationService: PersonalNotificationService,
  ) {}

  async create(
    user: UserEntity,
    notification: NotificationEntity,
  ): Promise<PersonalNotificationEntity> {
    return await this.personalNotificationService.create(user, notification);
  }
}
