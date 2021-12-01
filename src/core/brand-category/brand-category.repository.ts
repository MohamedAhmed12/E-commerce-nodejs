import { EntityRepository, Repository } from 'typeorm';

import { BrandCategoryEntity } from './brand-category.entity';

@EntityRepository(BrandCategoryEntity)
export class BrandCategoryRepository extends Repository<BrandCategoryEntity> {}
