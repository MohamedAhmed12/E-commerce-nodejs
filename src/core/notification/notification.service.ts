import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { PersonalNotificationService } from 'src/core/personal-notification/personal-notification.service';
import { UserService } from 'src/core/user/services/user.service';
import { BrandCreatedEvent, EventAction } from 'src/events/common.event';
import {
  NotificationActionType,
  NotificationEntityType,
} from 'src/graphql-types';

import { CaslAction } from '../../common/casl/casl.constants';
import { UserEntity } from '../user/user.entity';

import { NotificationEntity } from './notification.entity';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private personalNotificationService: PersonalNotificationService,
    private userService: UserService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  findOne(id: string): Promise<NotificationEntity> {
    return this.notificationRepository.findOne(id);
  }

  async getNotificationList(
    currentUser: UserEntity,
  ): Promise<NotificationEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, NotificationEntity)) {
      throw new Error('You are not authorized to read Notifications');
    }

    return await this.notificationRepository
      .createQueryBuilder('notification')
      .innerJoinAndSelect(
        'notification.personalNotifications',
        'personalNotifications',
      )
      .where('personalNotifications.userId = :userId', {
        userId: currentUser.id,
      })
      .getMany();
  }

  async create(
    entityType: NotificationEntityType,
    actionType: NotificationActionType,
    entityId: string,
  ): Promise<NotificationEntity> {
    const notification = new NotificationEntity();
    notification.entityType = entityType;
    notification.actionType = actionType;
    notification.entityId = entityId;

    return await this.notificationRepository.save(notification);
  }

  @OnEvent(EventAction.BRAND_CREATED, { async: true })
  async handleOrderCreatedEvent(payload: BrandCreatedEvent) {
    const users = await this.userService.findUsersByAccountId(
      payload.accountId,
    );

    const notification = await this.create(
      NotificationEntityType.BRAND,
      NotificationActionType.CREATE,
      payload.brandId,
    );

    await Promise.all(
      users.map(async (user) => {
        return await this.personalNotificationService.create(
          user,
          notification,
        );
      }),
    );
  }
}
