import { EntityRepository, Repository } from 'typeorm';

import { CurrencyEntity } from './currency.entity';

@EntityRepository(CurrencyEntity)
export class CurrencyRepository extends Repository<CurrencyEntity> {}
