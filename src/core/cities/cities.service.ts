import { Injectable } from '@nestjs/common';

import { CityRepository } from './cities.repository';
import { CityEntity } from './city.entity';
import { BulkCreateCityInput } from './inputs/bulk-create-city.input';

@Injectable()
export class CitiesService {
  constructor(private readonly cityRepository: CityRepository) {}

  async bulkCreate(cities: BulkCreateCityInput[]): Promise<void> {
    const cityEntities: CityEntity[] = [];

    cities.forEach((city) => {
      const cityEntity = new CityEntity();
      cityEntity.name = city.name;
      cityEntity.countryId = city.countryId;
      cityEntities.push(cityEntity);
    });

    await this.cityRepository.save(cityEntities);
  }

  async findAll(): Promise<CityEntity[]> {
    return await this.cityRepository.find();
  }

  async findOne(id: number): Promise<CityEntity> {
    return await this.cityRepository.findOne(id);
  }
}
