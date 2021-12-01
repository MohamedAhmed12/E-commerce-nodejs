import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { CreateProductInput } from '../../src/core/product/inputs/create-product.input';
import { ProductService } from '../../src/core/product/product.service';
import { UserEntity } from '../../src/core/user/user.entity';
import {
  AssignProductToLinesheetInput,
  Product,
} from '../../src/graphql-types';

@Injectable()
export class ProductFactory {
  constructor(private productService: ProductService) {}

  async create(input: CreateProductInput, user: UserEntity): Promise<Product> {
    return this.productService.createProduct(input, user);
  }

  async assignProductToLinesheet(
    input: AssignProductToLinesheetInput,
    user: UserEntity,
  ): Promise<Product> {
    return this.productService.assignProductToLinesheetWithAbility(input, user);
  }

  async archive(productId: string, user: UserEntity): Promise<UpdateResult> {
    return this.productService.archive(productId, user);
  }
}
