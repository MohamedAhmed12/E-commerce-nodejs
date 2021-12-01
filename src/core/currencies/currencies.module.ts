import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrenciesSeeder } from 'src/database/seeds/seeders/currencies.seeder';

import { CurrenciesResolver } from './currencies.resolver';
import { CurrenciesService } from './currencies.service';
import { CurrencyRepository } from './currency.repository';

@Module({
  providers: [CurrenciesResolver, CurrenciesService, CurrenciesSeeder],
  imports: [TypeOrmModule.forFeature([CurrencyRepository])],
  exports: [CurrenciesService, CurrenciesSeeder],
})
export class CurrenciesModule {}
