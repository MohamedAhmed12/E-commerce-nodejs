import { Injectable } from '@nestjs/common';

import { ProductSeasonEntity } from './product-season.entity';
import { ProductSeasonRepository } from './product-season.repository';

@Injectable()
export class ProductSeasonsService {
  constructor(
    private readonly productSeasonRepository: ProductSeasonRepository,
  ) {}

  async create(name: string): Promise<ProductSeasonEntity> {
    const productColor = new ProductSeasonEntity();
    productColor.name = name;

    return this.productSeasonRepository.save(productColor);
  }

  async findAll(): Promise<ProductSeasonEntity[]> {
    return this.productSeasonRepository.find();
  }
  async findOne(id: string): Promise<ProductSeasonEntity> {
    return this.productSeasonRepository.findOne(id);
  }

  async findOneByName(name: string): Promise<ProductSeasonEntity> {
    return this.productSeasonRepository.findOne({ name });
  }

  async findOrCreate(name: string): Promise<ProductSeasonEntity> {
    const productColor = await this.findOneByName(name);

    if (productColor) {
      return productColor;
    }

    return this.create(name);
  }
}
