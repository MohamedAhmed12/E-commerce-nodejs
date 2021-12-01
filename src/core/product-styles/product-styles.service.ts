import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

import { ProductSubCategoryEntity } from '../product-sub-category/product-sub-category.entity';

import { ProductStyleEntity } from './product-style.entity';
import { ProductStyleRepository } from './product-style.repository';

@Injectable()
export class ProductStylesService {
  constructor(
    private readonly productStyleRepository: ProductStyleRepository,
  ) {}

  async create(
    name: string,
    productSubCategory: ProductSubCategoryEntity,
  ): Promise<ProductStyleEntity> {
    const productStyle = new ProductStyleEntity();
    productStyle.name = name;
    productStyle.productSubCategory = productSubCategory;

    const errors = await validate(productStyle);

    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    }

    return this.productStyleRepository.save(productStyle);
  }

  async findOneByNameAndSubCategoryId(
    name: string,
    productSubCategoryId: string,
  ): Promise<ProductStyleEntity> {
    return this.productStyleRepository.findOne({
      name,
      productSubCategory: {
        id: productSubCategoryId,
      },
    });
  }

  async findOrCreate(
    name: string,
    productSubCategory: ProductSubCategoryEntity,
  ): Promise<ProductStyleEntity> {
    const productStyle = await this.findOneByNameAndSubCategoryId(
      name,
      productSubCategory.id,
    );

    if (productStyle) {
      return productStyle;
    }

    return this.create(name, productSubCategory);
  }

  async findAll(): Promise<ProductStyleEntity[]> {
    return this.productStyleRepository.find();
  }
}
