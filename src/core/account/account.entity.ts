import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { BrandEntity } from 'src/core/brand/brand.entity';
// eslint-disable-next-line import/no-cycle
import { CartEntity } from 'src/core/cart/cart.entity';
// eslint-disable-next-line import/no-cycle
import { UserEntity } from 'src/core/user/user.entity';
import { AccountType } from 'src/graphql-types';

@Entity({ name: 'accounts' })
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  type: AccountType;

  @OneToMany(() => BrandEntity, (brand: BrandEntity) => brand.account)
  brands: BrandEntity[];

  @OneToMany(() => UserEntity, (user: UserEntity) => user.account)
  users: UserEntity[];

  @OneToOne(() => CartEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  cart: CartEntity;
}
