import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';
// eslint-disable-next-line import/no-cycle
import { QuantitySizesCartItemEntity } from 'src/core/quantity-sizes-cart-item/quantity-sizes-cart-item.entity';
// eslint-disable-next-line import/no-cycle
import { SizeChartEntity } from 'src/core/size-chart/size-chart.entity';

@Entity({ name: 'sizes' })
export class SizeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToOne(
    () => SizeChartEntity,
    (sizeChart: SizeChartEntity) => sizeChart.sizes,
  )
  @JoinColumn()
  sizeChart: SizeChartEntity;

  @ManyToMany(() => ProductEntity, (product) => product.selectedSizes)
  @JoinTable()
  products: ProductEntity[];

  @OneToMany(
    () => QuantitySizesCartItemEntity,
    (quantitySizes: QuantitySizesCartItemEntity) => quantitySizes.size,
  )
  @JoinTable()
  quantitiesSizes: QuantitySizesCartItemEntity[];
}
