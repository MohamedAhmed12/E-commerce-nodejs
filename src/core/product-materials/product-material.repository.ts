import { EntityRepository, Repository } from 'typeorm';

import { ProductMaterialEntity } from './product-material.entity';

@EntityRepository(ProductMaterialEntity)
export class ProductMaterialRepository extends Repository<ProductMaterialEntity> {}
