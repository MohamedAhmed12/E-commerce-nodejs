import { Injectable } from '@nestjs/common';

import { RetailerEntity } from './retailer.entity';
import { RetailerRepository } from './retailer.repository';

@Injectable()
export class RetailersService {
  constructor(private readonly retailerRepository: RetailerRepository) {}

  async findAll() {
    return await this.retailerRepository.find();
  }

  async findOne(id: number) {
    return await this.retailerRepository.findOne(id);
  }

  async findOrCreate(
    name: string,
    description: string,
  ): Promise<RetailerEntity> {
    const retailer = await this.retailerRepository.findOne({ name });

    if (retailer !== undefined) {
      return retailer;
    }

    const newRetailer = new RetailerEntity();
    newRetailer.name = name;
    newRetailer.description = description;

    return await this.retailerRepository.save(newRetailer);
  }
}
