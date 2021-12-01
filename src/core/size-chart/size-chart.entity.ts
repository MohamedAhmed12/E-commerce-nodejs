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
import { ProductSubCategoryEntity } from 'src/core/product-sub-category/product-sub-category.entity';
// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';
// eslint-disable-next-line import/no-cycle
import { SizeEntity } from 'src/core/size/size.entity';

@Entity({ name: 'size_charts' })
export class SizeChartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @OneToMany(() => SizeEntity, (size: SizeEntity) => size.sizeChart, {
    eager: true,
  })
  sizes: SizeEntity[];

  @ManyToOne(
    () => ProductSubCategoryEntity,
    (subCategory: ProductSubCategoryEntity) => subCategory.sizeCharts,
  )
  @JoinColumn()
  productSubCategory: ProductSubCategoryEntity;

  @OneToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.productSubCategory,
  )
  @JoinColumn()
  products: ProductEntity[];
}
