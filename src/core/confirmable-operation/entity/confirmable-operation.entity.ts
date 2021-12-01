import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DateTimeValueTransformer } from '../../../util/typeorm/DateTimeValueTransformer';
// import { ConfirmableOperation } from '../model/confirmable-operation';

@Entity({ name: 'confirmable_operations' })
export class ConfirmableOperationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column()
  // userId: string;

  @Column({ nullable: false })
  operation: string;

  @Column()
  emailToken: string;

  @Column({ type: 'timestamp', transformer: DateTimeValueTransformer })
  emailConfirmedAt: DateTime;

  @Column({
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
    nullable: false,
  })
  expiresAt: DateTime;

  @CreateDateColumn({
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
  })
  createdAt: DateTime;

  @UpdateDateColumn({
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
  })
  updatedAt: DateTime;
}
