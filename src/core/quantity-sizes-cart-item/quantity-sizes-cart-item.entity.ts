import { Min } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { CartItemEntity } from 'src/core/cart-item/cart-item.entity';
// eslint-disable-next-line import/no-cycle
import { SizeEntity } from 'src/core/size/size.entity';

@Entity({ name: 'quantity_sizes_cart_items' })
export class QuantitySizesCartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Min(0)
  quantity: number;

  @ManyToOne(
    () => CartItemEntity,
    (cartItem: CartItemEntity) => cartItem.quantitiesSizes,
  )
  @JoinColumn()
  cartItem: CartItemEntity;

  @ManyToOne(() => SizeEntity, (size: SizeEntity) => size.quantitiesSizes, {
    eager: true,
  })
  @JoinTable()
  size: SizeEntity;
}
