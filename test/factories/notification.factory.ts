import { Injectable } from '@nestjs/common';

import { NotificationEntity } from '../../src/core/notification/notification.entity';
import { NotificationService } from '../../src/core/notification/notification.service';
import {
  NotificationActionType,
  NotificationEntityType,
} from '../../src/graphql-types';

@Injectable()
export class NotificationFactory {
  constructor(private notificationService: NotificationService) {}

  async create(
    entityType: NotificationEntityType,
    actionType: NotificationActionType,
    entityId: string,
  ): Promise<NotificationEntity> {
    return await this.notificationService.create(
      entityType,
      actionType,
      entityId,
    );
  }
}
