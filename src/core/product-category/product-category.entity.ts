import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { ProductSubCategoryEntity } from 'src/core/product-sub-category/product-sub-category.entity';

// eslint-disable-next-line import/no-cycle
import { GenderEntity } from '../genders/gender.entity';
// eslint-disable-next-line import/no-cycle
import { ProductMaterialEntity } from '../product-materials/product-material.entity';
// eslint-disable-next-line import/no-cycle
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'product_categories' })
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @OneToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.productSubCategory,
  )
  @JoinColumn()
  products: ProductEntity[];

  @OneToMany(
    () => ProductSubCategoryEntity,
    (productSubCategory: ProductSubCategoryEntity) =>
      productSubCategory.productCategory,
    {
      eager: true,
      nullable: true,
    },
  )
  @JoinColumn()
  productSubCategories: ProductSubCategoryEntity[];

  @ManyToOne(() => GenderEntity, (gender: GenderEntity) => gender.categories, {
    lazy: true,
    nullable: true,
  })
  @JoinColumn()
  productGender: GenderEntity;

  @ManyToMany(
    () => ProductMaterialEntity,
    (productMaterial: ProductMaterialEntity) =>
      productMaterial.productCategories,
    { nullable: true },
  )
  productMaterials: ProductMaterialEntity[];
}
