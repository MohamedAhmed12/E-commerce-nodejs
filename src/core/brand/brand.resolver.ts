import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';
import { UserEntity } from 'src/core/user/user.entity';

import { CustomResponse, CustomResponseStatus } from '../../graphql-types';

import { BrandEntity } from './brand.entity';
import { BrandService } from './brand.service';
import { CreateBrandInput } from './inputs/create-brand.input';
import { EditBrandInput } from './inputs/edit-brand.input';

@Resolver()
export class BrandResolver {
  constructor(private brandService: BrandService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async brand(
    @Args('brandId') brandId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BrandEntity> {
    return this.brandService.brand(brandId, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async brands(
    @Args('accountId') accountId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BrandEntity[]> {
    return await this.brandService.getBrands(currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async systemBrands(
    @Args('accountId') accountId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BrandEntity[]> {
    return await this.brandService.getSystemBrands(accountId, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async myBrands(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BrandEntity[]> {
    return await this.brandService.getMyBrands(currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async favouriteBrands(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BrandEntity[]> {
    return this.brandService.queryFavouriteBrands(currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createBrand(
    @Args('input') input: CreateBrandInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BrandEntity> {
    return this.brandService.createBrand(input, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async editBrand(
    @Args('input') input: EditBrandInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BrandEntity> {
    return this.brandService.editBrand(input, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async assignBadge(
    @Args('brandId') brandId: string,
    @Args('badgeId') badgeId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BrandEntity> {
    return this.brandService.assignBadge(brandId, badgeId, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async publishBrand(
    @Args('brandId') brandId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BrandEntity> {
    return this.brandService.publishBrand(brandId, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deactivateBrand(
    @Args('brandId') brandId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CustomResponse> {
    await this.brandService.deactivateBrand(brandId, currentUser);

    return {
      status: CustomResponseStatus.OK,
      message: 'deactivateBrand',
    };
  }
}
