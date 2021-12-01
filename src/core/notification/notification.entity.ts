import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { PersonalNotificationEntity } from 'src/core/personal-notification/personal-notification.entity';
import {
  NotificationActionType,
  NotificationEntityType,
} from 'src/graphql-types';

@Entity({ name: 'notifications' })
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationEntityType,
  })
  entityType: NotificationEntityType;

  @Column({
    type: 'enum',
    enum: NotificationActionType,
  })
  actionType: NotificationActionType;

  @Column()
  entityId: string;

  @OneToMany(
    () => PersonalNotificationEntity,
    (personalNotification: PersonalNotificationEntity) =>
      personalNotification.notification,
  )
  personalNotifications: PersonalNotificationEntity[];
}
