import { EntityRepository, Repository } from 'typeorm';

import { ProductImageEntity } from './product-image.entity';

@EntityRepository(ProductImageEntity)
export class ProductImageRepository extends Repository<ProductImageEntity> {}
