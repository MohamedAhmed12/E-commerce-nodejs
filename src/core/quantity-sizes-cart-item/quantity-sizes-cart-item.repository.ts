import { EntityRepository, Repository } from 'typeorm';

import { QuantitySizesCartItemEntity } from './quantity-sizes-cart-item.entity';

@EntityRepository(QuantitySizesCartItemEntity)
export class QuantitySizesCartItemRepository extends Repository<QuantitySizesCartItemEntity> {}
