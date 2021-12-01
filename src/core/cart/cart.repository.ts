import { EntityRepository, Repository } from 'typeorm';

import { CartEntity } from './cart.entity';

@EntityRepository(CartEntity)
export class CartRepository extends Repository<CartEntity> {}
