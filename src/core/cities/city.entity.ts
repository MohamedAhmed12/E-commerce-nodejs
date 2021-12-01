import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { CountryEntity } from '../countries/country.entity';

@Entity({ name: 'cities' })
export class CityEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ type: 'int', nullable: true })
  countryId: number;

  @ManyToOne(() => CountryEntity, (country: CountryEntity) => country.cities, {
    lazy: true,
  })
  @JoinColumn()
  country: CountryEntity;
}
