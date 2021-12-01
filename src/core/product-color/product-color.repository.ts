import { EntityRepository, Repository } from 'typeorm';

import { ProductColorEntity } from './product-color.entity';

@EntityRepository(ProductColorEntity)
export class ProductColorRepository extends Repository<ProductColorEntity> {}
