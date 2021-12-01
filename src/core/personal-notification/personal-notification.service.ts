import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { CaslAction } from 'src/common/casl/casl.constants';
import { NotificationEntity } from 'src/core/notification/notification.entity';
import { UserEntity } from 'src/core/user/user.entity';

import { PersonalNotificationEntity } from './personal-notification.entity';
import { PersonalNotificationRepository } from './personal-notification.repository';

@Injectable()
export class PersonalNotificationService {
  constructor(
    private readonly personalNotificationRepository: PersonalNotificationRepository,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async getNotificationList(
    currentUser: UserEntity,
  ): Promise<PersonalNotificationEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, PersonalNotificationEntity)) {
      throw new Error('You are not authorized to read Notifications');
    }

    return await this.personalNotificationRepository
      .createQueryBuilder('personal_notifications')
      .innerJoinAndSelect('personal_notifications.notification', 'notification')
      .where('personal_notifications.userId = :userId', {
        userId: currentUser.id,
      })
      .getMany();
  }

  async create(
    user: UserEntity,
    notification: NotificationEntity,
  ): Promise<PersonalNotificationEntity> {
    const personalNotification = new PersonalNotificationEntity();
    personalNotification.user = user;
    personalNotification.notification = notification;

    return this.personalNotificationRepository.save(personalNotification);
  }

  async setAsRead(
    notificationId: string,
    currentUser: UserEntity,
  ): Promise<PersonalNotificationEntity> {
    const personalNotification =
      await this.personalNotificationRepository.findOne({
        relations: ['notification', 'user'],
        where: {
          notification: { id: notificationId },
          user: { id: currentUser.id },
        },
      });

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.UPDATE, personalNotification)) {
      throw new Error('You are not authorized to setAsRead this Notification');
    }

    if (!personalNotification.readAt) {
      personalNotification.readAt = DateTime.local();
    }

    return this.personalNotificationRepository.save(personalNotification);
  }
}
