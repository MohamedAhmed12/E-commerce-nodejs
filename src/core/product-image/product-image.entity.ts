import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';

// eslint-disable-next-line import/no-cycle
import { ProductColorEntity } from '../product-color/product-color.entity';

@Entity({ name: 'product_images' })
export class ProductImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  src: string;

  @Column()
  @IsNotEmpty()
  order: number;

  @Column({
    nullable: true,
  })
  colorHex: string;

  @ManyToOne(() => ProductColorEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  color: ProductColorEntity;

  @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.images)
  @JoinColumn()
  product: ProductEntity;
}
