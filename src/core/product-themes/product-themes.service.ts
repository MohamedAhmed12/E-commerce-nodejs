import { Injectable } from '@nestjs/common';

import { ProductThemeEntity } from './product-theme.entity';
import { ProductThemeRepository } from './product-theme.repository';

@Injectable()
export class ProductThemesService {
  constructor(
    private readonly productThemeRepository: ProductThemeRepository,
  ) {}

  async create(name: string): Promise<ProductThemeEntity> {
    const productColor = new ProductThemeEntity();
    productColor.name = name;

    return this.productThemeRepository.save(productColor);
  }

  async findOne(id: string): Promise<ProductThemeEntity> {
    return this.productThemeRepository.findOne(id);
  }

  async findOneByName(name: string): Promise<ProductThemeEntity> {
    return this.productThemeRepository.findOne({ name });
  }

  async findOrCreate(name: string): Promise<ProductThemeEntity> {
    const productColor = await this.findOneByName(name);

    if (productColor) {
      return productColor;
    }

    return this.create(name);
  }

  async findAll(): Promise<ProductThemeEntity[]> {
    return this.productThemeRepository.find();
  }
}
