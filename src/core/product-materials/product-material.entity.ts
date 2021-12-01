import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { ProductCategoryEntity } from 'src/core/product-category/product-category.entity';
// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';

@Entity({ name: 'product_materials' })
export class ProductMaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToMany(
    () => ProductCategoryEntity,
    (productCategory) => productCategory.productMaterials,
    { lazy: true },
  )
  @JoinTable({
    name: 'product_categories_product_materials',
    joinColumn: {
      name: 'productMaterialId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'productCategoryId',
      referencedColumnName: 'id',
    },
  })
  productCategories: ProductCategoryEntity[];

  @OneToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.productSubCategory,
    { nullable: true, lazy: true },
  )
  @JoinColumn()
  products: ProductEntity[];
}
