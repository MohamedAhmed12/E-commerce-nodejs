import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CitiesSeeder } from 'src/database/seeds/seeders/cities.seeder';

import { CityRepository } from './cities.repository';
import { CitiesResolver } from './cities.resolver';
import { CitiesService } from './cities.service';

@Module({
  providers: [CitiesResolver, CitiesService, CitiesSeeder],
  imports: [TypeOrmModule.forFeature([CityRepository])],
  exports: [CitiesService, CitiesSeeder],
})
export class CitiesModule {}
