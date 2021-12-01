import { EntityRepository, Repository } from 'typeorm';

import { BrandBadgeEntity } from './brand-badge.entity';

@EntityRepository(BrandBadgeEntity)
export class BrandBadgeRepository extends Repository<BrandBadgeEntity> {}
