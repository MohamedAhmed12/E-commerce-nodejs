import { EntityRepository, Repository } from 'typeorm';

import { BadgeEntity } from './badge.entity';

@EntityRepository(BadgeEntity)
export class BadgeRepository extends Repository<BadgeEntity> {}
