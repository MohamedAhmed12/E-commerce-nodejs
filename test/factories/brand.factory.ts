import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { BrandEntity } from '../../src/core/brand/brand.entity';
import { BrandService } from '../../src/core/brand/brand.service';
import { CreateBrandInput } from '../../src/core/brand/inputs/create-brand.input';
import { UserEntity } from '../../src/core/user/user.entity';

@Injectable()
export class BrandFactory {
  constructor(private brandService: BrandService) {}

  async create(
    input: CreateBrandInput,
    user: UserEntity,
  ): Promise<BrandEntity> {
    return await this.brandService.createBrand(input, user);
  }

  async publishBrand(brandId: string, user: UserEntity): Promise<BrandEntity> {
    return this.brandService.publishBrand(brandId, user);
  }

  async deactivateBrand(
    brandId: string,
    user: UserEntity,
  ): Promise<UpdateResult> {
    return this.brandService.deactivateBrand(brandId, user);
  }
}
