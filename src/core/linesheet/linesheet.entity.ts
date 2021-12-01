import { Min } from 'class-validator';
import { DateTime } from 'luxon';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { BrandEntity } from 'src/core/brand/brand.entity';
// eslint-disable-next-line import/no-cycle
import { ProductEntity } from 'src/core/product/product.entity';
import { DateTimeValueTransformer } from 'src/util/typeorm/DateTimeValueTransformer';

import { MinSequenceNo } from './linesheet.constants';

@Entity({ name: 'linesheets' })
export class LinesheetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => BrandEntity, (brand: BrandEntity) => brand.linesheets, {
    eager: true,
  })
  @JoinColumn()
  brand: BrandEntity;

  @Column()
  @Min(MinSequenceNo)
  sequenceNo: number;

  @Column({
    type: 'timestamp',
    transformer: DateTimeValueTransformer,
    nullable: true,
  })
  archivedAt: DateTime;

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(() => ProductEntity, (product: ProductEntity) => product.linesheet)
  products: ProductEntity[];
}
