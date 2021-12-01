import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { ProductCategoryEntity } from '../product-category/product-category.entity';
// eslint-disable-next-line import/no-cycle
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'genders' })
export class GenderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @OneToMany(
    () => ProductCategoryEntity,
    (category: ProductCategoryEntity) => category.productGender,
    {
      lazy: true,
      nullable: true,
    },
  )
  @JoinColumn()
  categories: ProductCategoryEntity[];

  @OneToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.productGender,
  )
  @JoinColumn()
  products: ProductEntity[];
}
