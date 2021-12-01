import { IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { CityEntity } from '../cities/city.entity';

@Entity({ name: 'countries' })
export class CountryEntity {
  @PrimaryColumn('int')
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @OneToMany(() => CityEntity, (city: CityEntity) => city.country, {
    lazy: true,
  })
  @JoinColumn()
  cities: CityEntity[];
}
