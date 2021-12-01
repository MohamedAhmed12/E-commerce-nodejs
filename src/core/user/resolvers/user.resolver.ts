import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';

import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';
import {
  EditProfileInput,
  InviteAdminInput,
  InviteUserToAccountInput,
  CustomResponseStatus,
  CustomResponse,
  // AssetUploadUrlAndKey,
} from 'src/graphql-types';

import { RequestAccessToPlatformInput } from '../inputs/request-access-to-platform.input';
import { UserService } from '../services/user.service';
import { UserEntity } from '../user.entity';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() currentUser: UserEntity): Promise<UserEntity> {
    return currentUser;
  }

  @Mutation()
  async inviteAdmins(
    @Args('input') input: InviteAdminInput[],
    @CurrentUser() currentUser: UserEntity,
  ): Promise<UserEntity[]> {
    return this.userService.inviteSystemUsers(input, currentUser);
  }

  @Mutation()
  async inviteUsersToAccount(
    @Args('input') input: InviteUserToAccountInput[],
  ): Promise<UserEntity[]> {
    return this.userService.inviteUsersToAccount(input);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async editProfile(
    @Args('input') input: EditProfileInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<UserEntity> {
    const updatedUser = await this.userService.editProfile(
      input,
      currentUser.id,
    );

    return updatedUser;
  }

  @Mutation()
  async requestAccessToPlatform(
    @Args('input') input: RequestAccessToPlatformInput,
  ): Promise<CustomResponse> {
    await this.userService.requestAccessToPlatform(input);

    return {
      message: 'requestAccessToPlatform successful',
      status: CustomResponseStatus.OK,
    };
  }

  // @Query()
  // @UseGuards(GqlAuthGuard)
  // async assetUploadUrlAndKey(): Promise<AssetUploadUrlAndKey> {
  //   return this.userService.getAssetUploadUrlAndKey();
  // }
}
