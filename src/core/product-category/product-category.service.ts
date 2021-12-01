import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

import { ProductCategoryEntity } from './product-category.entity';
import { ProductCategoryRepository } from './product-category.repository';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) {}

  async create(name: string): Promise<ProductCategoryEntity> {
    const productCategory = new ProductCategoryEntity();
    productCategory.name = name;

    const errors = await validate(productCategory);

    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    }

    return this.productCategoryRepository.save(productCategory);
  }

  async findOne(id: string): Promise<ProductCategoryEntity> {
    return this.productCategoryRepository.findOne({
      where: { id },
      relations: ['productSubCategories'],
    });
  }

  async findOneByName(name: string): Promise<ProductCategoryEntity> {
    return this.productCategoryRepository.findOne({ name });
  }

  async findOrCreate(name: string): Promise<ProductCategoryEntity> {
    const productCategory = await this.findOneByName(name);

    if (productCategory) {
      return productCategory;
    }

    return this.create(name);
  }

  async getProductCategories(): Promise<ProductCategoryEntity[]> {
    return this.productCategoryRepository.find({
      relations: ['productSubCategories', 'productMaterials'],
    });
  }
}
