import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { BrandEntity } from '../brand/brand.entity';

@Entity({ name: 'brand_categories' })
export class BrandCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @OneToMany(() => BrandEntity, (brand: BrandEntity) => brand.brandCategory, {
    lazy: true,
  })
  @JoinColumn()
  brands: BrandEntity[];
}
