import { Injectable } from '@nestjs/common';

import { AddColorVariationToProductImageInput } from 'src/graphql-types';

import { ProductColorService } from '../product-color/product-color.service';

import { ProductImageEntity } from './product-image.entity';
import { ProductImageRepository } from './product-image.repository';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
    private readonly productColorService: ProductColorService,
  ) {}

  async addColorVariation(
    input: AddColorVariationToProductImageInput,
  ): Promise<ProductImageEntity> {
    const productImage = await this.productImageRepository.findOne(input.id);
    const productColor = await this.productColorService.findOne(input.colorId);

    productImage.colorHex = input.colorHex;
    productImage.color = productColor;
    return await this.productImageRepository.save(productImage);
  }
}
