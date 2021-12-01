import { DateTime } from 'luxon';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { CartEntity } from 'src/core/cart/cart.entity';
// eslint-disable-next-line import/no-cycle
import { ProductColorEntity } from 'src/core/product-color/product-color.entity';
// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';
// eslint-disable-next-line import/no-cycle
import { QuantitySizesCartItemEntity } from 'src/core/quantity-sizes-cart-item/quantity-sizes-cart-item.entity';
import { DateTimeValueTransformer } from 'src/util/typeorm/DateTimeValueTransformer';

@Entity({ name: 'cart_items' })
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CartEntity, (cart: CartEntity) => cart.cartItems, {
    eager: true,
  })
  @JoinColumn()
  cart: CartEntity;

  @ManyToOne(
    () => ProductEntity,
    (product: ProductEntity) => product.cartItems,
    { eager: true, cascade: true },
  )
  @JoinTable()
  product: ProductEntity;

  @ManyToOne(
    () => ProductColorEntity,
    (color: ProductColorEntity) => color.cartItems,
    { eager: true, nullable: true, cascade: true },
  )
  @JoinColumn()
  productColor: ProductColorEntity;

  @OneToMany(
    () => QuantitySizesCartItemEntity,
    (quantitySizes: QuantitySizesCartItemEntity) => quantitySizes.cartItem,
    {
      eager: true,
      cascade: true,
    },
  )
  @JoinColumn()
  quantitiesSizes: QuantitySizesCartItemEntity[];

  @DeleteDateColumn({
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
    nullable: true,
  })
  removedAt: DateTime;

  @Column({ nullable: true })
  isAvailable: boolean;
}
