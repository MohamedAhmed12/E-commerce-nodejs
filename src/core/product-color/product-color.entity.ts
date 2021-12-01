import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { CartItemEntity } from 'src/core/cart-item/cart-item.entity';
// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';

@Entity({ name: 'product_colors' })
export class ProductColorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => ProductEntity, (product) => product.productColors)
  products: ProductEntity[];

  @OneToMany(
    () => CartItemEntity,
    (cartItem: CartItemEntity) => cartItem.productColor,
  )
  @JoinColumn()
  cartItems: CartItemEntity[];
}
