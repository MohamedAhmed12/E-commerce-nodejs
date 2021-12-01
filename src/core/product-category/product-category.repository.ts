import { EntityRepository, Repository } from 'typeorm';

import { ProductCategoryEntity } from './product-category.entity';

@EntityRepository(ProductCategoryEntity)
export class ProductCategoryRepository extends Repository<ProductCategoryEntity> {}
