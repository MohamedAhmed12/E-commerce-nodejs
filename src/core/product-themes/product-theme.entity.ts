import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';

@Entity({ name: 'product_themes' })
export class ProductThemeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.productThemes,
  )
  @JoinTable({
    name: 'products_product_themes',
    joinColumn: {
      name: 'themeId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
  })
  products: ProductEntity[];
}
