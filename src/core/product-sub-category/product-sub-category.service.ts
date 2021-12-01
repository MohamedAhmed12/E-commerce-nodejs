import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

import { ProductCategoryEntity } from 'src/core/product-category/product-category.entity';

import { ProductSubCategoryEntity } from './product-sub-category.entity';
import { ProductSubCategoryRepository } from './product-sub-category.repository';

@Injectable()
export class ProductSubCategoryService {
  constructor(
    private readonly productSubCategoryRepository: ProductSubCategoryRepository,
  ) {}

  async findOne(id: string): Promise<ProductSubCategoryEntity> {
    return this.productSubCategoryRepository.findOne(id);
  }

  async findOneOrThrowError(id: string): Promise<ProductSubCategoryEntity> {
    const subCategory = await this.findOne(id);

    if (!subCategory) {
      throw new Error(`Sub-category with id="${id}" does not exist`);
    }

    return subCategory;
  }

  async create(
    name: string,
    productCategory: ProductCategoryEntity,
  ): Promise<ProductSubCategoryEntity> {
    const productSubCategory = new ProductSubCategoryEntity();
    productSubCategory.name = name;
    productSubCategory.productCategory = productCategory;

    const errors = await validate(productSubCategory);

    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    }

    return this.productSubCategoryRepository.save(productSubCategory);
  }

  async findOneByName(name: string): Promise<ProductSubCategoryEntity> {
    return this.productSubCategoryRepository.findOne({ name });
  }

  async findOneByNameAndCategoryId(
    name: string,
    productCategoryId: string,
  ): Promise<ProductSubCategoryEntity> {
    return this.productSubCategoryRepository.findOne({
      name,
      productCategory: {
        id: productCategoryId,
      },
    });
  }

  async findOrCreate(
    name: string,
    productCategory: ProductCategoryEntity,
  ): Promise<ProductSubCategoryEntity> {
    const productSubCategory = await this.findOneByNameAndCategoryId(
      name,
      productCategory.id,
    );

    if (productSubCategory) {
      return productSubCategory;
    }

    return this.create(name, productCategory);
  }

  async getProductSubCategories(): Promise<ProductSubCategoryEntity[]> {
    return this.productSubCategoryRepository.find();
  }
}
