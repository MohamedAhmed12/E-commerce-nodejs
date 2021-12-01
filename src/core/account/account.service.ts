import { Injectable } from '@nestjs/common';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { CaslAction } from 'src/common/casl/casl.constants';
import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { CartService } from 'src/core/cart/cart.service';
import { UserEntity } from 'src/core/user/user.entity';
import { AccountType, SystemAccountsInput } from 'src/graphql-types';

import { CartEntity } from '../cart/cart.entity';

import { AccountEntity } from './account.entity';
import { AccountRepository } from './account.repository';
import { EditAccountInput } from './inputs/edit-account.input';

@Injectable({})
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly cartService: CartService,
  ) {}

  findOne(id: string): Promise<AccountEntity> {
    return this.accountRepository.findOne(id);
  }

  findOneByName(name: string): Promise<AccountEntity> {
    return this.accountRepository.findOne({ name });
  }

  async findOneOrThrowError(id: string): Promise<AccountEntity> {
    const account = await this.accountRepository.findOne(id);

    if (!account) {
      throw new Error(`Account with id="${id}" does not exist`);
    }

    return account;
  }

  findOneByIdWithBrands(id: string): Promise<AccountEntity> {
    const options = {
      where: {
        id,
      },
      relations: ['brands'],
    };

    return this.accountRepository.findOne(options);
  }

  async create(
    name: string,
    type: AccountType,
    cart: CartEntity | null,
  ): Promise<AccountEntity> {
    const account = new AccountEntity();
    account.name = name;
    account.type = type;
    account.cart = cart;

    return this.accountRepository.save(account);
  }

  async createAccount(
    name: string,
    type: AccountType,
    currentUser: UserEntity,
  ): Promise<AccountEntity> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to create an account');
    }

    let cart = null;

    if (![AccountType.BRAND_ACCOUNT, AccountType.SHOWROOM].includes(type)) {
      cart = await this.cartService.create();
    }

    return this.create(name, type, cart);
  }

  async editAccount(
    input: EditAccountInput,
    currentUser: UserEntity,
  ): Promise<AccountEntity> {
    const account = await this.findOneOrThrowError(input.accountId);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.UPDATE, account)) {
      throw new Error('You are not authorized to edit an account');
    }

    account.name = input.name || account.name;

    return this.accountRepository.save(account);
  }

  async getMyAccount(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<AccountEntity> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ_MY, currentUser.account)) {
      throw new Error('You are not authorized to read a myAccount');
    }

    return currentUser.account;
  }

  async getSystemAccount(
    accountId: string,
    currentUser: UserEntity,
  ): Promise<AccountEntity> {
    const account = await this.findOneOrThrowError(accountId);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to read an systemAccount');
    }

    return account;
  }

  async getSystemAccounts(
    input: SystemAccountsInput,
    currentUser: UserEntity,
  ): Promise<AccountEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to read an systemAccounts');
    }

    const query = this.accountRepository.createQueryBuilder('account');

    if (input.type) {
      query.andWhere('account.type = :accountType', {
        accountType: input.type,
      });
    }

    return query.getMany();
  }
}
