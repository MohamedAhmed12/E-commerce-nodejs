import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';

@Entity({ name: 'product_labels' })
export class ProductLabelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @OneToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.productThemes,
    {
      nullable: true,
    },
  )
  @JoinColumn()
  products: ProductEntity[];
}
