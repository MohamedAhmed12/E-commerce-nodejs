import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { validate } from 'class-validator';
import { DateTime } from 'luxon';
import { IsNull, UpdateResult, Not } from 'typeorm';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { CaslAction } from 'src/common/casl/casl.constants';
import { AccountService } from 'src/core/account/account.service';
import { BadgeService } from 'src/core/badge/badge.service';
import { BrandCreatedEvent, EventAction } from 'src/events/common.event';
import { AccountType } from 'src/graphql-types';

import { AccountEntity } from '../account/account.entity';
import { UserEntity } from '../user/user.entity';

import { BrandEntity } from './brand.entity';
import { BrandRepository } from './brand.repository';
import { CreateBrandInput } from './inputs/create-brand.input';
import { EditBrandInput } from './inputs/edit-brand.input';

@Injectable({})
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private accountService: AccountService,
    private eventEmitter: EventEmitter2,
    private badgeService: BadgeService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async findOne(id: string): Promise<BrandEntity> {
    return this.brandRepository.findOne(id);
  }

  async findOneByName(name: string): Promise<BrandEntity> {
    return this.brandRepository.findOne({ name });
  }

  async findOneOrThrowError(id: string): Promise<BrandEntity> {
    const brand = await this.findOne(id);

    if (!brand) {
      throw new Error(`Brand with id=${id} does not exists`);
    }

    return brand;
  }

  async findOnePublishOrThrowError(id: string): Promise<BrandEntity> {
    const brand = await this.brandRepository.findOne({
      id,
      publishedAt: Not(IsNull()),
    });

    if (!brand) {
      throw new Error(`Brand with id=${id} does not exists`);
    }

    return brand;
  }

  async findOneByIdAndAccountIdOrThrowError(
    brandId: string,
    accountId: string,
  ): Promise<BrandEntity> {
    const brand = await this.brandRepository.findOne({
      id: brandId,
      account: {
        id: accountId,
      },
    });

    if (!brand) {
      throw new Error(
        `Brand with id=${brandId} does not exists in account with id="${accountId}"`,
      );
    }

    return brand;
  }

  async findOneWithRelations(
    id: string,
    relations: string[],
  ): Promise<BrandEntity> {
    return this.brandRepository.findOne(id, { relations });
  }

  async brand(brandId: string, currentUser: UserEntity): Promise<BrandEntity> {
    const brand = await this.findOneOrThrowError(brandId);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, brand)) {
      throw new Error('You are not authorized to read this Brand');
    }

    return brand;
  }

  async getBrands(currentUser: UserEntity): Promise<BrandEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, BrandEntity)) {
      throw new Error('You are not authorized to query brands');
    }

    return await this.brandRepository.find({
      relations: ['operators'],
    });
    // .createQueryBuilder('brand')
    // .where('brand.publishedAt is not null')
    // .innerJoinAndSelect('brand.users', 'users');

    // return await query.getMany();
  }

  async getSystemBrands(
    accountId: string = null,
    currentUser: UserEntity,
  ): Promise<BrandEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to query systemBrands');
    }

    const query = this.brandRepository.createQueryBuilder('brand');
    query.innerJoinAndSelect('brand.account', 'account');

    if (accountId) {
      query.andWhere('account.id = :accountId', { accountId: accountId });
    }

    return query.getMany();
  }

  async getMyBrands(currentUser: UserEntity): Promise<BrandEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ_MY, BrandEntity)) {
      throw new Error('You are not authorized to query myBrands');
    }

    const query = this.brandRepository.createQueryBuilder('brand');

    query.innerJoinAndSelect('brand.account', 'account');
    query.where('account.id = :accountId', {
      accountId: currentUser.account?.id,
    });

    return query.getMany();
  }

  async queryFavouriteBrands(currentUser: UserEntity): Promise<BrandEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, BrandEntity)) {
      throw new Error('You are not authorized to query brands');
    }

    return currentUser.favouriteBrands;
  }

  async create(
    account: AccountEntity,
    name: string,
    description: string,
  ): Promise<BrandEntity> {
    const brand = new BrandEntity();
    brand.name = name;

    if (description !== undefined) {
      brand.description = description;
    }

    brand.account = account;

    const errors = await validate(brand);

    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    }

    return this.brandRepository.save(brand);
  }

  async createBrand(
    input: CreateBrandInput,
    currentUser: UserEntity,
  ): Promise<BrandEntity> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.CREATE, BrandEntity)) {
      throw new Error('You are not authorized to create an Brand');
    }

    const account = await this.accountService.findOneByIdWithBrands(
      input.accountId,
    );

    if (!account) {
      throw new Error(`Account with id="${input.accountId}" does not exists`);
    }

    if (
      ![AccountType.BRAND_ACCOUNT, AccountType.SHOWROOM].includes(account.type)
    ) {
      throw new Error(
        `Account with id="${input.accountId}" cannot have brands`,
      );
    }

    if (
      AccountType.BRAND_ACCOUNT === account.type &&
      account.brands?.length === 1
    ) {
      throw new Error(
        `Account with id="${input.accountId}" already have one brand and it cannot create any more`,
      );
    }

    const brand = await this.create(account, input.name, input.description);

    const brandCreatedEvent = new BrandCreatedEvent();
    brandCreatedEvent.accountId = input.accountId;
    brandCreatedEvent.brandId = brand.id;

    this.eventEmitter.emit(EventAction.BRAND_CREATED, brandCreatedEvent);

    return brand;
  }

  async editBrand(
    input: EditBrandInput,
    currentUser: UserEntity,
  ): Promise<BrandEntity> {
    const brand = await this.findOneOrThrowError(input.id);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.UPDATE, brand)) {
      throw new Error('You are not authorized to edit an Brand');
    }

    if (input.name !== undefined) {
      brand.name = input.name;
    }

    if (input.description !== undefined) {
      brand.description = input.description;
    }

    return this.brandRepository.save(brand);
  }

  async assignBadge(
    brandId,
    badgeId,
    currentUser: UserEntity,
  ): Promise<BrandEntity> {
    const brand = await this.findOneOrThrowError(brandId);
    const badge = await this.badgeService.findOneOrThrowError(badgeId);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to assign Badge on an Brand');
    }

    brand.badges.push(badge);

    return this.brandRepository.save(brand);
  }

  async publishBrand(
    brandId: string,
    currentUser: UserEntity,
  ): Promise<BrandEntity> {
    const brand = await this.findOneOrThrowError(brandId);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to publish an Brand');
    }

    if (brand.publishedAt) {
      throw new Error(`Brand with id="${brandId}" is published already`);
    }

    brand.publishedAt = DateTime.local();

    return this.brandRepository.save(brand);
  }

  async deactivateBrand(
    brandId: string,
    currentUser: UserEntity,
  ): Promise<UpdateResult> {
    const brand = await this.findOneOrThrowError(brandId);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.DELETE, BrandEntity)) {
      throw new Error('You are not authorized to deactivate this brand');
    }

    return this.brandRepository.softDelete(brand.id);
  }
}
