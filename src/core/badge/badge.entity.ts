import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { BrandEntity } from 'src/core/brand/brand.entity';

@Entity({ name: 'badges' })
export class BadgeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => BrandEntity, (brand) => brand.badges)
  @JoinTable({
    name: 'brands_badges',
    joinColumn: {
      name: 'badgeId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'brandId',
      referencedColumnName: 'id',
    },
  })
  brands: BrandEntity[];
}
