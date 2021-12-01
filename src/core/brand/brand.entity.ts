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
import { AccountEntity } from 'src/core/account/account.entity';
// eslint-disable-next-line import/no-cycle
import { BadgeEntity } from 'src/core/badge/badge.entity';
// eslint-disable-next-line import/no-cycle
import { LinesheetEntity } from 'src/core/linesheet/linesheet.entity';
// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';
// eslint-disable-next-line import/no-cycle
import { UserEntity } from 'src/core/user/user.entity';
import { DateTimeValueTransformer } from 'src/util/typeorm/DateTimeValueTransformer';

// eslint-disable-next-line import/no-cycle
import { BrandCategoryEntity } from '../brand-category/brand-category.entity';
// eslint-disable-next-line import/no-cycle
import { BrandKeywordEntity } from '../brand-keywords/brand-keyword.entity';

@Entity({ name: 'brands' })
export class BrandEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
    nullable: true,
  })
  publishedAt: DateTime;

  @DeleteDateColumn({
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
    nullable: true,
  })
  deactivatedAt: DateTime;

  @ManyToMany(() => AccountEntity, (account: AccountEntity) => account.brands)
  @JoinColumn()
  account: AccountEntity;

  @ManyToMany(() => UserEntity, (user) => user.favouriteBrands)
  @JoinTable({
    name: 'favourite_brands',
    joinColumn: {
      name: 'brandId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];

  @OneToMany(() => UserEntity, (operator: UserEntity) => operator.brand)
  operators: UserEntity[];

  @OneToMany(
    () => LinesheetEntity,
    (linesheet: LinesheetEntity) => linesheet.brand,
  )
  linesheets: LinesheetEntity[];

  @OneToMany(() => ProductEntity, (product: ProductEntity) => product.linesheet)
  @JoinColumn()
  products: ProductEntity[];

  @ManyToMany(() => BadgeEntity, (badge) => badge.brands, { eager: true })
  @JoinTable({
    name: 'brands_badges',
    joinColumn: {
      name: 'brandId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'badgeId',
      referencedColumnName: 'id',
    },
  })
  badges: BadgeEntity[];

  @ManyToMany(() => BrandKeywordEntity, (keywords) => keywords.brands)
  keywords: BrandKeywordEntity[];

  @ManyToOne(
    () => BrandCategoryEntity,
    (brandCategory: BrandCategoryEntity) => brandCategory.brands,
    {
      lazy: true,
    },
  )
  @JoinColumn()
  brandCategory: BrandCategoryEntity;
}
