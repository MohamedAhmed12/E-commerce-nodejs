import { Injectable } from '@nestjs/common';

import { ProductColorEntity } from './product-color.entity';
import { ProductColorRepository } from './product-color.repository';

@Injectable()
export class ProductColorService {
  constructor(
    private readonly productColorRepository: ProductColorRepository,
  ) {}

  async create(name: string): Promise<ProductColorEntity> {
    const productColor = new ProductColorEntity();
    productColor.name = name;

    return this.productColorRepository.save(productColor);
  }

  async findOne(id: string): Promise<ProductColorEntity> {
    return this.productColorRepository.findOne(id);
  }

  async findByIds(ids: string[]): Promise<ProductColorEntity[]> {
    return this.productColorRepository
      .createQueryBuilder('productColor')
      .where('id IN (:...ids)', { ids: ids })
      .getMany();
  }

  async findOneByName(name: string): Promise<ProductColorEntity> {
    return this.productColorRepository.findOne({ name });
  }

  async findOrCreate(name: string): Promise<ProductColorEntity> {
    const productColor = await this.findOneByName(name);

    if (productColor) {
      return productColor;
    }

    return this.create(name);
  }

  async findAll(): Promise<ProductColorEntity[]> {
    return this.productColorRepository.find();
  }
}
