import { Injectable } from '@nestjs/common';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { CaslAction } from 'src/common/casl/casl.constants';
import { BrandEntity } from 'src/core/brand/brand.entity';
import { BrandService } from 'src/core/brand/brand.service';
import { UserEntity } from 'src/core/user/user.entity';

import { FavouriteBrandEntity } from './favourite-brand.entity';
import { FavouriteBrandRepository } from './favourite-brand.repository';

@Injectable({})
export class FavouriteBrandService {
  constructor(
    private readonly favouriteBrandRepository: FavouriteBrandRepository,
    private readonly brandService: BrandService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async createFavouriteBrand(
    currentUser: UserEntity,
    brandId: string,
  ): Promise<BrandEntity> {
    const brand = await this.brandService.findOnePublishOrThrowError(brandId);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE_FAVOURITE, brand)) {
      throw new Error('You are not authorized to create this favourite brand');
    }

    await this.create(currentUser, brand);

    return brand;
  }

  async create(
    user: UserEntity,
    brand: BrandEntity,
  ): Promise<FavouriteBrandEntity> {
    const favouriteBrand = new FavouriteBrandEntity();

    favouriteBrand.user = user;
    favouriteBrand.brand = brand;

    return await this.favouriteBrandRepository.save(favouriteBrand);
  }

  async removeBrandFromFavourites(
    currentUser: UserEntity,
    brandId: string,
  ): Promise<BrandEntity> {
    const brand = await this.brandService.findOneOrThrowError(brandId);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE_FAVOURITE, brand)) {
      throw new Error(
        'You are not authorized to remove this brand from favourite',
      );
    }

    await this.favouriteBrandRepository.delete({
      user: currentUser,
      brand,
    });

    return brand;
  }
}
