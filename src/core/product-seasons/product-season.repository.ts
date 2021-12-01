import { EntityRepository, Repository } from 'typeorm';

import { ProductSeasonEntity } from './product-season.entity';

@EntityRepository(ProductSeasonEntity)
export class ProductSeasonRepository extends Repository<ProductSeasonEntity> {}
