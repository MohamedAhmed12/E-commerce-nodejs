import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { BrandEntity } from '../brand/brand.entity';

@Entity({ name: 'brand_keywords' })
export class BrandKeywordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => BrandEntity, (brand) => brand.keywords, {
    nullable: true,
    cascade: true,
  })
  @JoinTable({
    name: 'brands_brand_keywords',
    joinColumn: {
      name: 'keywordId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'brandId',
      referencedColumnName: 'id',
    },
  })
  brands: BrandEntity[];
}
