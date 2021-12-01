import { Injectable } from '@nestjs/common';

import { PaymentTermEntity } from './payment-term.entity';
import { PaymentTermRepository } from './payment-term.repository';

@Injectable()
export class PaymentTermsService {
  constructor(private readonly paymentTermRepository: PaymentTermRepository) {}

  async create(name: string): Promise<PaymentTermEntity> {
    const productColor = new PaymentTermEntity();
    productColor.name = name;

    return this.paymentTermRepository.save(productColor);
  }

  async findOneByName(name: string): Promise<PaymentTermEntity> {
    return this.paymentTermRepository.findOne({ name });
  }

  async findOrCreate(name: string): Promise<PaymentTermEntity> {
    const productColor = await this.findOneByName(name);

    if (productColor) {
      return productColor;
    }

    return this.create(name);
  }

  async findAll(): Promise<PaymentTermEntity[]> {
    return this.paymentTermRepository.find();
  }
}
