import { EntityRepository, Repository } from 'typeorm';

import { ShippingTermEntity } from './shipping-term.entity';

@EntityRepository(ShippingTermEntity)
export class ShippingTermRepository extends Repository<ShippingTermEntity> {}
