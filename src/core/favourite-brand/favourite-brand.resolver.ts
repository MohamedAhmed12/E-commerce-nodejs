import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';
import { BrandEntity } from 'src/core/brand/brand.entity';
import { UserEntity } from 'src/core/user/user.entity';
import { CustomResponse, CustomResponseStatus } from 'src/graphql-types';

import { FavouriteBrandService } from './favourite-brand.service';

@Resolver()
export class FavouriteBrandResolver {
  constructor(private favouriteBrandService: FavouriteBrandService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createFavouriteBrand(
    @CurrentUser() currentUser: UserEntity,
    @Args('brandId') brandId: string,
  ): Promise<BrandEntity> {
    return this.favouriteBrandService.createFavouriteBrand(
      currentUser,
      brandId,
    );
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async removeBrandFromFavourites(
    @CurrentUser() currentUser: UserEntity,
    @Args('brandId') brandId: string,
  ): Promise<CustomResponse> {
    await this.favouriteBrandService.removeBrandFromFavourites(
      currentUser,
      brandId,
    );

    return {
      status: CustomResponseStatus.OK,
      message: 'Brand successfully removed from favourites',
    };
  }
}
