import { EntityRepository, Repository } from 'typeorm';

import { RetailerEntity } from './retailer.entity';

@EntityRepository(RetailerEntity)
export class RetailerRepository extends Repository<RetailerEntity> {}
