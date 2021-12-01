import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';

// eslint-disable-next-line import/no-cycle
import { ProductSubCategoryEntity } from '../product-sub-category/product-sub-category.entity';

@Entity({ name: 'product_styles' })
export class ProductStyleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToOne(
    () => ProductSubCategoryEntity,
    (productSubCategory: ProductSubCategoryEntity) => productSubCategory.styles,
    { eager: true },
  )
  @JoinColumn()
  productSubCategory: ProductSubCategoryEntity;

  @OneToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.productStyle,
  )
  @JoinColumn()
  products: ProductEntity[];
}
