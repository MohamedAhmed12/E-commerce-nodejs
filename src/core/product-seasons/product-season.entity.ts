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

@Entity({ name: 'product_seasons' })
export class ProductSeasonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @OneToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.productSeason,
    {
      nullable: true,
    },
  )
  @JoinColumn()
  products: ProductEntity[];
}
