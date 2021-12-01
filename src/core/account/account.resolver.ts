import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';
import { UserEntity } from 'src/core/user/user.entity';
import { AccountType, SystemAccountsInput } from 'src/graphql-types';

import { AccountEntity } from './account.entity';
import { AccountService } from './account.service';
import { EditAccountInput } from './inputs/edit-account.input';

@Resolver()
export class AccountResolver {
  constructor(private accountService: AccountService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createAccount(
    @Args('name') name: string,
    @Args('type') type: AccountType,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AccountEntity> {
    return this.accountService.createAccount(name, type, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async editAccount(
    @Args('input') input: EditAccountInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AccountEntity> {
    return this.accountService.editAccount(input, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async myAccount(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AccountEntity> {
    return this.accountService.getMyAccount(currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async systemAccount(
    @Args('accountId') accountId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AccountEntity> {
    return this.accountService.getSystemAccount(accountId, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async systemAccounts(
    @Args('input') input: SystemAccountsInput = {},
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AccountEntity[]> {
    return this.accountService.getSystemAccounts(input, currentUser);
  }
}
