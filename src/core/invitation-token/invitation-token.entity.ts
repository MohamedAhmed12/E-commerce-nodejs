import { DateTime } from 'luxon';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Generated,
  CreateDateColumn,
} from 'typeorm';

import { UserEntity } from 'src/core/user/user.entity';
import { DateTimeValueTransformer } from 'src/util/typeorm/DateTimeValueTransformer';

@Entity({ name: 'invitation_tokens' })
export class InvitationTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  token: string;

  @CreateDateColumn({
    nullable: true,
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
  })
  acceptedAt: DateTime;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
