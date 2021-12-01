import { Injectable } from '@nestjs/common';

import { BrandCategoryEntity } from './brand-category.entity';
import { BrandCategoryRepository } from './brand-category.repository';

@Injectable()
export class BrandCategoryService {
  constructor(
    private readonly brandCategoryRepository: BrandCategoryRepository,
  ) {}

  async create(name: string): Promise<BrandCategoryEntity> {
    const brandCategory = new BrandCategoryEntity();
    brandCategory.name = name;

    return this.brandCategoryRepository.save(brandCategory);
  }
  async findOne(id: string): Promise<BrandCategoryEntity> {
    return await this.brandCategoryRepository.findOne(id);
  }

  async findAll(): Promise<BrandCategoryEntity[]> {
    return await this.brandCategoryRepository.find();
  }
}
