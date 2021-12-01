import { Injectable } from '@nestjs/common';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { CaslAction } from 'src/common/casl/casl.constants';
import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { CartEntity } from 'src/core/cart/cart.entity';
import { ProductColorEntity } from 'src/core/product-color/product-color.entity';
import { ProductEntity } from 'src/core/product/product.entity';
import { ProductService } from 'src/core/product/product.service';
import { QuantitySizesCartItemEntity } from 'src/core/quantity-sizes-cart-item/quantity-sizes-cart-item.entity';
import { QuantitySizesCartItemService } from 'src/core/quantity-sizes-cart-item/quantity-sizes-cart-item.service';
import { SizeEntity } from 'src/core/size/size.entity';
import { UserEntity } from 'src/core/user/user.entity';
import { sameMembers } from 'src/hepler';

import { CartItemEntity } from './cart-item.entity';
import { CartItemRepository } from './cart-item.repository';
import { CreateCartItemInput } from './inputs/create-cart-item.input';
import { EditCartItemInput } from './inputs/edit-cart-item.input';
import { SizeIdWithQuantityInput } from './inputs/size-id-with-quantity.input';

@Injectable({})
export class CartItemService {
  constructor(
    private readonly cartItemRepository: CartItemRepository,
    private readonly productService: ProductService,
    private readonly quantitySizesCartItemService: QuantitySizesCartItemService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async findOne(id: string): Promise<CartItemEntity> {
    return this.cartItemRepository.findOne(id);
  }

  async findOneByIdAndAccountId(
    cartItemId: string,
    accountId: string,
  ): Promise<CartItemEntity> {
    const query = this.cartItemRepository
      .createQueryBuilder('cartItem')
      .where('cartItem.id = :cartItemId', { cartItemId })
      .innerJoinAndSelect('cartItem.product', 'product')
      .innerJoinAndSelect('product.productColors', 'productColors')
      .innerJoinAndSelect('product.selectedSizes', 'selectedSizes')
      .innerJoinAndSelect('product.brand', 'brand')
      .innerJoinAndSelect('product.linesheet', 'linesheet')
      .innerJoinAndSelect('cartItem.cart', 'cart')
      .innerJoinAndSelect('cart.account', 'account')
      .andWhere('account.id = :accountId', { accountId });

    return query.getOne();
  }

  async findOneByIdAndAccountIdOrThrowError(
    cartItemId: string,
    accountId: string,
  ): Promise<CartItemEntity> {
    const cartItem = this.findOneByIdAndAccountId(cartItemId, accountId);

    if (!cartItem) {
      throw new Error(
        `CartItem with id="${cartItemId}" does not exist in account with id="${accountId}"`,
      );
    }

    return cartItem;
  }

  async create(
    product: ProductEntity,
    cart: CartEntity,
    productColor: ProductColorEntity | null,
    quantitySizes: QuantitySizesCartItemEntity[],
  ): Promise<CartItemEntity> {
    const cartItem = new CartItemEntity();

    cartItem.product = product;
    cartItem.cart = cart;
    cartItem.productColor = productColor;
    cartItem.quantitiesSizes = quantitySizes;

    return this.cartItemRepository.save(cartItem);
  }

  getProductColor(
    productColorId: string,
    productColors: ProductColorEntity[],
    productId: string,
  ): ProductColorEntity | null {
    let productColor = null;

    if (productColorId) {
      productColor = productColors.find((color: ProductColorEntity) => {
        return color.id === productColorId;
      });

      if (!productColor) {
        throw new Error(
          `Product color with id="${productColorId}" does not exist in product with id="${productId}"`,
        );
      }
    }

    return productColor;
  }

  async getQuantitySizes(
    sizeIdsWithQuantity: SizeIdWithQuantityInput[],
    productSelectedSizes: SizeEntity[],
  ): Promise<QuantitySizesCartItemEntity[]> {
    const sizeIds = sizeIdsWithQuantity.map(
      (sizeIdWithQuantity: SizeIdWithQuantityInput) =>
        sizeIdWithQuantity.sizeId,
    );

    const productSelectedSizeIds = productSelectedSizes.map(
      (selectedSize: SizeEntity) => selectedSize.id,
    );

    const isMatchesSizeIds = sameMembers(sizeIds, productSelectedSizeIds);

    if (!isMatchesSizeIds) {
      throw new Error(
        `SizeIds in sizeIdsWithQuantity do not match with selectedSizes in product`,
      );
    }

    return this.quantitySizesCartItemService.createQuantitySizes(
      sizeIdsWithQuantity,
    );
  }

  async createCartItem(
    input: CreateCartItemInput,
    currentUser: UserEntity,
  ): Promise<CartItemEntity> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.CREATE, CartItemEntity)) {
      throw new Error('You are not authorized to create cartItem');
    }

    const product =
      await this.productService.findOneAvailableProductOrThrowError(
        input.productId,
      );

    const productColor = this.getProductColor(
      input.productColorId,
      product.productColors,
      product.id,
    );

    const quantitySizes = await this.getQuantitySizes(
      input.sizeIdsWithQuantity,
      product.selectedSizes,
    );

    const cart = currentUser.account.cart;

    const createdCartItem = await this.create(
      product,
      cart,
      productColor,
      quantitySizes,
    );

    return {
      ...createdCartItem,
      isAvailable: true,
    };
  }

  async editCartItem(
    input: EditCartItemInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CartItemEntity> {
    const cartItem = await this.findOneByIdAndAccountIdOrThrowError(
      input.cartItemId,
      currentUser.account.id,
    );

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.UPDATE, cartItem)) {
      throw new Error('You are not authorized to update cartItem');
    }

    const product =
      await this.productService.findOneAvailableProductOrThrowError(
        cartItem.product.id,
      );

    if (input.productColorId) {
      const productColor = this.getProductColor(
        input.productColorId,
        product.productColors,
        product.id,
      );

      cartItem.productColor = productColor;
    }

    if (input.sizeIdsWithQuantity) {
      const quantitySizes = await this.getQuantitySizes(
        input.sizeIdsWithQuantity,
        product.selectedSizes,
      );

      cartItem.quantitiesSizes = quantitySizes;
    }

    const editedCartItem = await this.cartItemRepository.save(cartItem);

    return {
      ...editedCartItem,
      isAvailable: true,
    };
  }

  async removeCartItem(cartItemId: string, currentUser: UserEntity) {
    const cartItem = await this.findOneByIdAndAccountIdOrThrowError(
      cartItemId,
      currentUser.account.id,
    );

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.DELETE, cartItem)) {
      throw new Error('You are not authorized to update cartItem');
    }

    return this.cartItemRepository.softDelete(cartItemId);
  }

  async addIsAvailableToCartItems(
    cartItems: CartItemEntity[],
  ): Promise<CartItemEntity[]> {
    return Promise.all(
      cartItems.map(async (cartItem: CartItemEntity) => {
        return this.addIsAvailableToCartItem(cartItem);
      }),
    );
  }

  async addIsAvailableToCartItem(
    cartItem: CartItemEntity,
  ): Promise<CartItemEntity> {
    const isAvailable = await this.isAvailableCartItem(cartItem.product.id);

    return {
      ...cartItem,
      isAvailable,
    };
  }

  async isAvailableCartItem(productId: string): Promise<boolean> {
    const product = await this.productService.findOneAvailableProduct(
      productId,
    );

    return !!product;
  }

  async getMyCartItems(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CartItemEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ_MY, CartItemEntity)) {
      throw new Error('You are not authorized to read myCartItem');
    }

    const cart = currentUser.account.cart;

    const cartItems = await this.cartItemRepository
      .createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.cart', 'cart')
      .andWhere('cart.id = :cartId', { cartId: cart.id })
      .leftJoinAndSelect('cartItem.productColor', 'productColor')
      .leftJoinAndSelect('cartItem.quantitiesSizes', 'quantitiesSizes')
      .leftJoinAndSelect('quantitiesSizes.size', 'size')
      .withDeleted()
      .leftJoinAndSelect('cartItem.product', 'product')
      .innerJoinAndSelect('product.productColors', 'productColors')
      .innerJoinAndSelect('product.selectedSizes', 'selectedSizes')
      .innerJoinAndSelect('product.brand', 'brand')
      .innerJoinAndSelect('product.linesheet', 'linesheet')
      .getMany();

    return this.addIsAvailableToCartItems(cartItems);
  }
}
