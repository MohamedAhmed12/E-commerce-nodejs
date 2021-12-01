import { EntityRepository, Repository } from 'typeorm';

import { CartItemEntity } from './cart-item.entity';

@EntityRepository(CartItemEntity)
export class CartItemRepository extends Repository<CartItemEntity> {}
