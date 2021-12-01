import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { DateTime } from 'luxon';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { AccountEntity } from 'src/core/account/account.entity';
// eslint-disable-next-line import/no-cycle
import { BrandEntity } from 'src/core/brand/brand.entity';
// eslint-disable-next-line import/no-cycle
import { AbilityType } from 'src/graphql-types';
import { DateTimeValueTransformer } from 'src/util/typeorm/DateTimeValueTransformer';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  @Length(1)
  firstName: string;

  @Column()
  @IsNotEmpty()
  @Length(1)
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({
    nullable: true,
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
  })
  emailConfirmedAt: DateTime;

  @Column({
    type: 'enum',
    enum: AbilityType,
  })
  abilityType: AbilityType;

  @ManyToOne(() => AccountEntity, (account: AccountEntity) => account.users, {
    nullable: true,
    eager: true,
  })
  account: AccountEntity;

  @ManyToOne(() => BrandEntity, (brand: BrandEntity) => brand.operators, {
    nullable: true,
  })
  brand: BrandEntity;

  @ManyToMany(() => BrandEntity, (brand) => brand.users, { eager: true })
  @JoinTable({
    name: 'favourite_brands',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'brandId',
      referencedColumnName: 'id',
    },
  })
  favouriteBrands: BrandEntity[];
}
