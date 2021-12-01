import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';
import { UserEntity } from 'src/core/user/user.entity';
import {
  AssignProductToLinesheetInput,
  CustomResponse,
  CustomResponseStatus,
  Product,
  ProductsQuery,
} from 'src/graphql-types';

import { CreateProductInput } from './inputs/create-product.input';
import { EditProductInput } from './inputs/edit-product.input';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async products(
    @Args('input') input: ProductsQuery,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<Product[]> {
    return this.productService.getProducts(input, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async myProducts(
    @Args('input') input: ProductsQuery,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<Product[]> {
    return this.productService.getMyProducts(input, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async systemProducts(
    @Args('input') input: ProductsQuery,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<Product[]> {
    return this.productService.getSystemProducts(input, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async product(
    @Args('productId') productId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<Product> {
    return this.productService.getProduct(productId, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async myProduct(
    @Args('productId') productId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<Product> {
    return this.productService.getMyProduct(productId, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async systemProduct(
    @Args('productId') productId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<Product> {
    return this.productService.getSystemProduct(productId, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createProduct(
    @Args('input') input: CreateProductInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<Product> {
    return this.productService.createProduct(input, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async editProduct(
    @Args('input') input: EditProductInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<Product> {
    return this.productService.edit(input, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async assignProductToLinesheet(
    @Args('input') input: AssignProductToLinesheetInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<Product> {
    return this.productService.assignProductToLinesheetWithAbility(
      input,
      currentUser,
    );
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async archiveProduct(
    @Args('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CustomResponse> {
    await this.productService.archive(id, currentUser);

    return {
      status: CustomResponseStatus.OK,
      message: 'archiveProduct',
    };
  }
}
