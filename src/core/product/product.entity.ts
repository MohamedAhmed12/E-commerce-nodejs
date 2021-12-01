import { BigNumber } from 'bignumber.js';
import { IsNotEmpty } from 'class-validator';
import { DateTime } from 'luxon';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { BrandEntity } from 'src/core/brand/brand.entity';
// eslint-disable-next-line import/no-cycle
import { CartItemEntity } from 'src/core/cart-item/cart-item.entity';
// eslint-disable-next-line import/no-cycle
import { LinesheetEntity } from 'src/core/linesheet/linesheet.entity';
// eslint-disable-next-line import/no-cycle
import { ProductColorEntity } from 'src/core/product-color/product-color.entity';
// eslint-disable-next-line import/no-cycle
import { ProductImageEntity } from 'src/core/product-image/product-image.entity';
// eslint-disable-next-line import/no-cycle
import { ProductSubCategoryEntity } from 'src/core/product-sub-category/product-sub-category.entity';
// eslint-disable-next-line import/no-cycle
import { SizeChartEntity } from 'src/core/size-chart/size-chart.entity';
// eslint-disable-next-line import/no-cycle
import { SizeEntity } from 'src/core/size/size.entity';
// eslint-disable-next-line import/no-cycle
import { ProductImage } from 'src/graphql-types';
// eslint-disable-next-line import/no-cycle
import { BigNumberValueTransformer } from 'src/util/typeorm/BigNumberValueTransformer';
// eslint-disable-next-line import/no-cycle
import { DateTimeValueTransformer } from 'src/util/typeorm/DateTimeValueTransformer';

// eslint-disable-next-line import/no-cycle
import { CurrencyEntity } from '../currencies/currency.entity';
// eslint-disable-next-line import/no-cycle
import { GenderEntity } from '../genders/gender.entity';
// eslint-disable-next-line import/no-cycle
import { ProductCategoryEntity } from '../product-category/product-category.entity';
// eslint-disable-next-line import/no-cycle
import { ProductSeasonEntity } from '../product-seasons/product-season.entity';
// eslint-disable-next-line import/no-cycle
import { ProductStyleEntity } from '../product-styles/product-style.entity';
// eslint-disable-next-line import/no-cycle
import { ProductThemeEntity } from '../product-themes/product-theme.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  referenceCode: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: BigNumberValueTransformer,
  })
  @IsNotEmpty()
  wholesalePrice: BigNumber;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: BigNumberValueTransformer,
  })
  @IsNotEmpty()
  retailPrice: BigNumber;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  material: string;

  @Column({ nullable: true })
  minQuantity: number;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  tags: string[];

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
  })
  previewImages: string[];

  @DeleteDateColumn({
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
    nullable: true,
  })
  archivedAt: DateTime;

  @ManyToOne(
    () => LinesheetEntity,
    (linesheet: LinesheetEntity) => linesheet.products,
    { eager: true, nullable: true },
  )
  @JoinColumn()
  linesheet: LinesheetEntity;

  @Column({ type: 'string', nullable: true })
  currencyId: string;

  @ManyToOne(
    () => CurrencyEntity,
    (currency: CurrencyEntity) => currency.products,
    { eager: true, nullable: true },
  )
  @JoinColumn({ name: 'currencyId', referencedColumnName: 'id' })
  currency: CurrencyEntity;

  @ManyToOne(() => BrandEntity, (brand: BrandEntity) => brand.products, {
    eager: true,
  })
  @JoinColumn()
  brand: BrandEntity;

  @ManyToMany(() => ProductThemeEntity, (productTheme) => productTheme.products)
  productThemes: ProductThemeEntity[];

  @ManyToMany(
    () => ProductColorEntity,
    (productColor) => productColor.products,
    { cascade: true, eager: true },
  )
  @JoinTable({
    name: 'products_product_colors',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'productColorId',
      referencedColumnName: 'id',
    },
  })
  productColors: ProductColorEntity[];

  @ManyToOne(() => GenderEntity, (gender: GenderEntity) => gender.products, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  productGender: GenderEntity;

  @ManyToOne(
    () => ProductCategoryEntity,
    (category: ProductCategoryEntity) => category.products,
    {
      eager: true,
    },
  )
  @JoinColumn()
  productCategory: ProductCategoryEntity;

  @ManyToOne(
    () => ProductSubCategoryEntity,
    (subCategory: ProductSubCategoryEntity) => subCategory.products,
    {
      eager: true,
    },
  )
  @JoinColumn()
  productSubCategory: ProductSubCategoryEntity;

  @ManyToOne(
    () => ProductStyleEntity,
    (style: ProductStyleEntity) => style.products,
    {
      eager: true,
      nullable: true,
    },
  )
  @JoinColumn()
  productStyle: ProductSeasonEntity;

  @ManyToOne(
    () => ProductSeasonEntity,
    (season: ProductSeasonEntity) => season.products,
    {
      eager: true,
      nullable: true,
    },
  )
  @JoinColumn()
  productSeason: ProductSeasonEntity;

  @ManyToOne(
    () => SizeChartEntity,
    (sizeChart: SizeChartEntity) => sizeChart.products,
    {
      eager: true,
    },
  )
  @JoinColumn()
  sizeChart: SizeChartEntity;

  @ManyToMany(() => SizeEntity, (size: SizeEntity) => size.products, {
    eager: true,
  })
  @JoinColumn()
  selectedSizes: SizeEntity[];

  @OneToMany(
    () => CartItemEntity,
    (cartItem: CartItemEntity) => cartItem.product,
    { nullable: true },
  )
  @JoinColumn()
  cartItems: CartItemEntity[];

  @OneToMany(
    () => ProductImageEntity,
    (image: ProductImageEntity) => image.product,
    {
      eager: true,
      cascade: true,
    },
  )
  @JoinColumn()
  images: ProductImage[];
}
