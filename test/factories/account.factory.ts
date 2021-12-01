import { Injectable } from '@nestjs/common';

import { AccountEntity } from '../../src/core/account/account.entity';
import { AccountService } from '../../src/core/account/account.service';
import { UserEntity } from '../../src/core/user/user.entity';
import { AccountType } from '../../src/graphql-types';

@Injectable()
export class AccountFactory {
  constructor(private accountService: AccountService) {}

  async create(
    name: string,
    type: AccountType,
    user: UserEntity,
  ): Promise<AccountEntity> {
    return await this.accountService.createAccount(name, type, user);
  }
}
