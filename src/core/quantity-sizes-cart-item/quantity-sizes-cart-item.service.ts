import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

import { SizeIdWithQuantityInput } from 'src/core/cart-item/inputs/size-id-with-quantity.input';
import { SizeEntity } from 'src/core/size/size.entity';
import { SizeService } from 'src/core/size/size.service';

import { QuantitySizesCartItemEntity } from './quantity-sizes-cart-item.entity';
import { QuantitySizesCartItemRepository } from './quantity-sizes-cart-item.repository';

@Injectable({})
export class QuantitySizesCartItemService {
  constructor(
    private readonly quantitySizesCartItemRepository: QuantitySizesCartItemRepository,
    private readonly sizeService: SizeService,
  ) {}

  async create(
    quantity: number,
    size: SizeEntity,
  ): Promise<QuantitySizesCartItemEntity> {
    const quantitySize = new QuantitySizesCartItemEntity();

    quantitySize.quantity = quantity;
    quantitySize.size = size;

    const errors = await validate(quantitySize);

    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    }

    return this.quantitySizesCartItemRepository.save(quantitySize);
  }

  async createQuantitySizes(
    sizeIdsWithQuantity: SizeIdWithQuantityInput[],
  ): Promise<QuantitySizesCartItemEntity[]> {
    return Promise.all(
      sizeIdsWithQuantity.map(
        async (sizeIdWithQuantity: SizeIdWithQuantityInput) => {
          const size = await this.sizeService.findOne(
            sizeIdWithQuantity.sizeId,
          );
          return await this.create(sizeIdWithQuantity.quantity, size);
        },
      ),
    );
  }
}
