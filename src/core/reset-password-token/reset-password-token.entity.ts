import { DateTime } from 'luxon';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Generated,
} from 'typeorm';

import { UserEntity } from 'src/core/user/user.entity';
import { DateTimeValueTransformer } from 'src/util/typeorm/DateTimeValueTransformer';

@Entity({ name: 'reset_password_tokens' })
export class ResetPasswordTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  token: string;

  @Column({
    nullable: true,
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
  })
  acceptedAt: DateTime;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
