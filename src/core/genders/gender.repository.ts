import { EntityRepository, Repository } from 'typeorm';

import { GenderEntity } from './gender.entity';

@EntityRepository(GenderEntity)
export class GenderRepository extends Repository<GenderEntity> {}
