import { DateTime } from 'luxon';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DateTimeValueTransformer } from 'src/util/typeorm/DateTimeValueTransformer';

@Entity({ name: 'sessions' })
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    nullable: true,
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
  })
  expiresAt: DateTime;
}
