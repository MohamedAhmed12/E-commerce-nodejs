import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GendersSeeder } from 'src/database/seeds/seeders/genders.seeder';

import { GenderRepository } from './gender.repository';
import { GendersResolver } from './genders.resolver';
import { GendersService } from './genders.service';

@Module({
  providers: [GendersResolver, GendersService, GendersSeeder],
  imports: [TypeOrmModule.forFeature([GenderRepository])],
  exports: [GendersService, GendersSeeder],
})
export class GendersModule {}
