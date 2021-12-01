import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

import { ProductCategoryEntity } from 'src/core/product-category/product-category.entity';

import { ProductCategoryService } from '../product-category/product-category.service';

import { ProductMaterialEntity } from './product-material.entity';
import { ProductMaterialRepository } from './product-material.repository';

@Injectable()
export class ProductMaterialsService {
  constructor(
    private readonly productMaterialRepository: ProductMaterialRepository,
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  async findOne(conditions: any): Promise<ProductMaterialEntity> {
    return this.productMaterialRepository.findOne(conditions);
  }

  async findOneOrThrowError(id: string): Promise<ProductMaterialEntity> {
    const subCategory = await this.findOne(id);

    if (!subCategory) {
      throw new Error(`Sub-category with id="${id}" does not exist`);
    }

    return subCategory;
  }

  async create(
    name: string,
    productCategories: ProductCategoryEntity[],
  ): Promise<ProductMaterialEntity> {
    const productMaterial = new ProductMaterialEntity();
    productMaterial.name = name;
    productMaterial.productCategories = productCategories;

    const errors = await validate(productMaterial);

    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    }

    return this.productMaterialRepository.save(productMaterial);
  }

  async findOrCreate(
    name: string,
    productCategories: ProductCategoryEntity[],
  ): Promise<ProductMaterialEntity> {
    const productMaterial = await this.findOne({ name });

    if (productMaterial) {
      return productMaterial;
    }

    return this.create(name, productCategories);
  }

  async findAll(): Promise<ProductMaterialEntity[]> {
    return this.productMaterialRepository.find();
  }
}
