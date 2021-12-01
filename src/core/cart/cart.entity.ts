import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { AccountEntity } from 'src/core/account/account.entity';
// eslint-disable-next-line import/no-cycle
import { CartItemEntity } from 'src/core/cart-item/cart-item.entity';

@Entity({ name: 'carts' })
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    () => CartItemEntity,
    (cartItem: CartItemEntity) => cartItem.cart,
    {
      nullable: true,
    },
  )
  @JoinColumn()
  cartItems: CartItemEntity[];

  @OneToOne(() => AccountEntity, (account: AccountEntity) => account.cart)
  account: AccountEntity;
}
