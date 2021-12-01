import { Injectable } from '@nestjs/common';

import { BrandEntity } from '../../src/core/brand/brand.entity';
import { FavouriteBrandService } from '../../src/core/favourite-brand/favourite-brand.service';
import { UserEntity } from '../../src/core/user/user.entity';

@Injectable()
export class FavouriteBrandFactory {
  constructor(private favouriteBrandService: FavouriteBrandService) {}

  async create(user: UserEntity, brand: BrandEntity): Promise<BrandEntity> {
    return await this.favouriteBrandService.createFavouriteBrand(
      user,
      brand.id,
    );
  }
}
