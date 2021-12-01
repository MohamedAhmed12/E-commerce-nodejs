import { Injectable } from '@nestjs/common';

import { ProductColorEntity } from '../../src/core/product-color/product-color.entity';
import { ProductColorService } from '../../src/core/product-color/product-color.service';

@Injectable()
export class ProductColorFactory {
  constructor(private productColorService: ProductColorService) {}

  async findOrCreate(name: string): Promise<ProductColorEntity> {
    return await this.productColorService.findOrCreate(name);
  }
}
