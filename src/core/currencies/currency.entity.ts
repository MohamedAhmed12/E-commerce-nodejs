import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'currencies' })
export class CurrencyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @OneToMany(() => ProductEntity, (product: ProductEntity) => product.currency)
  products: ProductEntity[];
}
