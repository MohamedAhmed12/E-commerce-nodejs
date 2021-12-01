import { Injectable } from '@nestjs/common';

import { CountryEntity } from './country.entity';
import { CountryRepository } from './country.repository';
import { BulkCreateCountryInput } from './inputs/bulk-create-country.input';

@Injectable()
export class CountriesService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async bulkCreate(countries: BulkCreateCountryInput[]): Promise<void> {
    const countryEntities: CountryEntity[] = [];

    countries.forEach((country, index) => {
      const countryEntity = new CountryEntity();
      countryEntity.id = index + 1;
      countryEntity.name = country.name;
      countryEntities.push(countryEntity);
    });

    await this.countryRepository.save(countryEntities);
  }

  async findAll(): Promise<CountryEntity[]> {
    return await this.countryRepository.find();
  }

  async findOne(id: number): Promise<CountryEntity> {
    return await this.countryRepository.findOne(id);
  }
}
