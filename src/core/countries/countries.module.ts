import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountriesSeeder } from 'src/database/seeds/seeders/countries.seeder';

import { CountriesResolver } from './countries.resolver';
import { CountriesService } from './countries.service';
import { CountryRepository } from './country.repository';

@Module({
  providers: [CountriesResolver, CountriesService, CountriesSeeder],
  imports: [TypeOrmModule.forFeature([CountryRepository])],
  exports: [CountriesService, CountriesSeeder],
})
export class CountriesModule {}
