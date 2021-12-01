import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';
import { UserEntity } from 'src/core/user/user.entity';
import { CustomResponse, CustomResponseStatus } from 'src/graphql-types';

import { CartItemEntity } from './cart-item.entity';
import { CartItemService } from './cart-item.service';
import { CreateCartItemInput } from './inputs/create-cart-item.input';
import { EditCartItemInput } from './inputs/edit-cart-item.input';

@Resolver()
export class CartItemResolver {
  constructor(private cartItemService: CartItemService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createCartItem(
    @Args('input') input: CreateCartItemInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CartItemEntity> {
    return this.cartItemService.createCartItem(input, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async editCartItem(
    @Args('input') input: EditCartItemInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CartItemEntity> {
    return this.cartItemService.editCartItem(input, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async removeCartItem(
    @Args('cartItemId') cartItemId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CustomResponse> {
    await this.cartItemService.removeCartItem(cartItemId, currentUser);

    return {
      status: CustomResponseStatus.OK,
      message: `CartItem with id="${cartItemId}" was removed successfully`,
    };
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async myCartItems(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CartItemEntity[]> {
    return this.cartItemService.getMyCartItems(currentUser);
  }
}
