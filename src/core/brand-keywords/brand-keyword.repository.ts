import { EntityRepository, Repository } from 'typeorm';

import { BrandKeywordEntity } from './brand-keyword.entity';

@EntityRepository(BrandKeywordEntity)
export class BrandKeywordRepository extends Repository<BrandKeywordEntity> {}
