import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';

import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';

import { ChangeBrandUserTypeInput } from '../inputs/change-brand-user-type.input';
import { CreateBrandUserInput } from '../inputs/create-brand-user.input';
import { EditBrandUserInput } from '../inputs/edit-brand-user.input';
import { BrandAdminService } from '../services/brand-admin.service';
import { UserEntity } from '../user.entity';

@Resolver()
export class BrandAdminResolver {
  constructor(private brandAdminService: BrandAdminService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createBrandUser(
    @Args('input') input: CreateBrandUserInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<UserEntity> {
    const brandCreator = await this.brandAdminService.createBrandUser(
      input,
      currentUser,
    );

    return brandCreator;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async editBrandUser(
    @Args('input') input: EditBrandUserInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<UserEntity> {
    return await this.brandAdminService.editBrandUser(input, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async changeBrandUserType(
    @Args('input') input: ChangeBrandUserTypeInput,
    @CurrentUser() CurrentUser: UserEntity,
  ): Promise<UserEntity> {
    return await this.brandAdminService.changeBrandUserType(input, CurrentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteBrandUser(
    @Args('id') id: string,
    @CurrentUser() CurrentUser: UserEntity,
  ): Promise<string> {
    return await this.brandAdminService.deleteBrandUser(id, CurrentUser);
  }
}
