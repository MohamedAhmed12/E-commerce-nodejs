import { EntityRepository, Repository } from 'typeorm';

import { BrandEntity } from './brand.entity';

@EntityRepository(BrandEntity)
export class BrandRepository extends Repository<BrandEntity> {}
