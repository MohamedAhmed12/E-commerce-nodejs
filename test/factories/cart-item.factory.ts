import { Injectable } from '@nestjs/common';

import { CartItemEntity } from '../../src/core/cart-item/cart-item.entity';
import { CartItemService } from '../../src/core/cart-item/cart-item.service';
import { CreateCartItemInput } from '../../src/core/cart-item/inputs/create-cart-item.input';
import { UserEntity } from '../../src/core/user/user.entity';

@Injectable()
export class CartItemFactory {
  constructor(private cartItemService: CartItemService) {}

  async create(
    input: CreateCartItemInput,
    user: UserEntity,
  ): Promise<CartItemEntity> {
    return await this.cartItemService.createCartItem(input, user);
  }
}
