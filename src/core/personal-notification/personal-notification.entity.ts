import { DateTime } from 'luxon';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { NotificationEntity } from 'src/core/notification/notification.entity';
import { UserEntity } from 'src/core/user/user.entity';
import { DateTimeValueTransformer } from 'src/util/typeorm/DateTimeValueTransformer';

@Entity({ name: 'personal_notifications' })
export class PersonalNotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
  })
  readAt: DateTime;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => NotificationEntity)
  @JoinColumn()
  notification: NotificationEntity;
}
