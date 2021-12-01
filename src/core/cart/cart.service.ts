import { Injectable } from '@nestjs/common';

import { CartEntity } from './cart.entity';
import { CartRepository } from './cart.repository';

@Injectable({})
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async create(): Promise<CartEntity> {
    const cart = new CartEntity();

    return this.cartRepository.save(cart);
  }
}
