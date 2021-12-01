import { Injectable } from '@nestjs/common';

import { ProductLabelEntity } from './product-label.entity';
import { ProductLabelRepository } from './product-label.repository';

@Injectable()
export class ProductLabelsService {
  constructor(
    private readonly productLabelRepository: ProductLabelRepository,
  ) {}

  async create(name: string): Promise<ProductLabelEntity> {
    const productColor = new ProductLabelEntity();
    productColor.name = name;

    return this.productLabelRepository.save(productColor);
  }

  async findAll(): Promise<ProductLabelEntity[]> {
    return this.productLabelRepository.find();
  }
  async findOne(id: string): Promise<ProductLabelEntity> {
    return this.productLabelRepository.findOne(id);
  }

  async findOneByName(name: string): Promise<ProductLabelEntity> {
    return this.productLabelRepository.findOne({ name });
  }

  async findOrCreate(name: string): Promise<ProductLabelEntity> {
    const productColor = await this.findOneByName(name);

    if (productColor) {
      return productColor;
    }

    return this.create(name);
  }
}
