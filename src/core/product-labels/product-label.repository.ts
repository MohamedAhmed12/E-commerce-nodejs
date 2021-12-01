import { EntityRepository, Repository } from 'typeorm';

import { ProductLabelEntity } from './product-label.entity';

@EntityRepository(ProductLabelEntity)
export class ProductLabelRepository extends Repository<ProductLabelEntity> {}
