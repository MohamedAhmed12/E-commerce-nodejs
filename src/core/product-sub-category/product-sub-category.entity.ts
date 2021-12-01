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
import { ProductCategoryEntity } from 'src/core/product-category/product-category.entity';
// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';
// eslint-disable-next-line import/no-cycle
import { SizeChartEntity } from 'src/core/size-chart/size-chart.entity';

// eslint-disable-next-line import/no-cycle
import { ProductStyleEntity } from '../product-styles/product-style.entity';

@Entity({ name: 'product_sub_categories' })
export class ProductSubCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToOne(
    () => ProductCategoryEntity,
    (productCategory: ProductCategoryEntity) =>
      productCategory.productSubCategories,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  productCategory: ProductCategoryEntity;

  @OneToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.productSubCategory,
  )
  @JoinColumn()
  products: ProductEntity[];

  @OneToMany(
    () => ProductStyleEntity,
    (style: ProductStyleEntity) => style.productSubCategory,
  )
  @JoinColumn()
  styles: ProductStyleEntity[];

  @OneToMany(
    () => SizeChartEntity,
    (sizeChart: SizeChartEntity) => sizeChart.productSubCategory,
  )
  @JoinColumn()
  sizeCharts: SizeChartEntity[];
}
