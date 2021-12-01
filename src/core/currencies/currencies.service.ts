import { Injectable } from '@nestjs/common';

import { CurrencyEntity } from './currency.entity';
import { CurrencyRepository } from './currency.repository';

@Injectable()
export class CurrenciesService {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async create(name: string): Promise<CurrencyEntity> {
    const currency = new CurrencyEntity();
    currency.name = name;

    return this.currencyRepository.save(currency);
  }

  async findOne(id: string): Promise<CurrencyEntity> {
    return this.currencyRepository.findOne(id);
  }

  async findOneByName(name: string): Promise<CurrencyEntity> {
    return this.currencyRepository.findOne({ name });
  }

  async findOrCreate(name: string): Promise<CurrencyEntity> {
    const currency = await this.findOneByName(name);

    if (currency) {
      return currency;
    }

    return this.create(name);
  }

  async findAll(): Promise<CurrencyEntity[]> {
    return this.currencyRepository.find();
  }
}
