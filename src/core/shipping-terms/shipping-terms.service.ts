import { Injectable } from '@nestjs/common';

import { ShippingTermEntity } from './shipping-term.entity';
import { ShippingTermRepository } from './shipping-term.repository';

@Injectable()
export class ShippingTermsService {
  constructor(
    private readonly shippingTermRepository: ShippingTermRepository,
  ) {}

  async create(name: string): Promise<ShippingTermEntity> {
    const productColor = new ShippingTermEntity();
    productColor.name = name;

    return this.shippingTermRepository.save(productColor);
  }

  async findOneByName(name: string): Promise<ShippingTermEntity> {
    return this.shippingTermRepository.findOne({ name });
  }

  async findOrCreate(name: string): Promise<ShippingTermEntity> {
    const productColor = await this.findOneByName(name);

    if (productColor) {
      return productColor;
    }

    return this.create(name);
  }

  async findAll(): Promise<ShippingTermEntity[]> {
    return this.shippingTermRepository.find();
  }
}
