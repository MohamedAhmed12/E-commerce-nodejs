import { EntityRepository, Repository } from 'typeorm';

import { ProductSubCategoryEntity } from './product-sub-category.entity';

@EntityRepository(ProductSubCategoryEntity)
export class ProductSubCategoryRepository extends Repository<ProductSubCategoryEntity> {}
