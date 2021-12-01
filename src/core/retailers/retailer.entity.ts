import { IsNotEmpty } from 'class-validator';
import { DateTime } from 'luxon';
import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

import { DateTimeValueTransformer } from 'src/util/typeorm/DateTimeValueTransformer';

@Entity({ name: 'retailers' })
export class RetailerEntity {
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

  // TO DO craete CIty entity and handle relations here
  // @ManyToOne(() => CityEntity, (city: CityEntity) => city.retailers,
  //     {
  //         eager: true
  //     })
  // @JoinColumn()
  // city: CityEntity

  // TO DO craete Country entity and handle relations here
  // @ManyToOne(() => CountryEntity, (city: CountryEntity) => country.retailers,
  //     {
  //         eager: true
  //     })
  // @JoinColumn()
  // country: CountryEntity

  // TO DO craete files(images/videos) entity and handle relations here
  // @OneToOne(() => FileEntity,
  //     {
  //         eager: true
  //     })
  // @JoinColumn()
  // logo: FileEntity
}
