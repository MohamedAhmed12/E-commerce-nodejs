import { EntityRepository, Repository } from 'typeorm';

import { SizeEntity } from './size.entity';

@EntityRepository(SizeEntity)
export class SizeRepository extends Repository<SizeEntity> {}
