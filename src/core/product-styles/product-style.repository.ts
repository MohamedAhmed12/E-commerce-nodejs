import { EntityRepository, Repository } from 'typeorm';

import { ProductStyleEntity } from './product-style.entity';

@EntityRepository(ProductStyleEntity)
export class ProductStyleRepository extends Repository<ProductStyleEntity> {}
