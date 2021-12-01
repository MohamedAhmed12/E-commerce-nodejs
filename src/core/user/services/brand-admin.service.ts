import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { validate } from 'class-validator';
import { FindConditions } from 'typeorm';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { CaslAction } from 'src/common/casl/casl.constants';

import { ChangeBrandUserTypeInput } from '../inputs/change-brand-user-type.input';
import { CreateBrandUserInput } from '../inputs/create-brand-user.input';
import { EditBrandUserInput } from '../inputs/edit-brand-user.input';
import { UserEntity } from '../user.entity';
import { isBrandUser } from '../user.helper';
import { UserRepository } from '../user.repository';

@Injectable()
export class BrandAdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async check(user: UserEntity) {
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new Error(`Validation failed! errors: ${errors}`);
    }
  }

  async findOne(options?: FindConditions<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne(options);
  }

  async createBrandUser(
    input: CreateBrandUserInput,
    currentUser: UserEntity,
  ): Promise<UserEntity> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, UserEntity)) {
      throw new Error('You are not authorized to create brand creator');
    }

    const user = await this.findOne({ email: input.email });
    if (user) {
      throw new Error('A user with this email already existed!');
    }

    const passwordHash = await hash(input.password || '123456789', 10);

    const brandCreator = new UserEntity();
    brandCreator.email = input.email;
    brandCreator.firstName = input.firstName;
    brandCreator.lastName = input.lastName;
    brandCreator.passwordHash = passwordHash;
    brandCreator.phoneNumber = input.phoneNumber;
    brandCreator.title = input.title;
    brandCreator.abilityType = input.abilityType;

    await this.check(brandCreator);

    return this.userRepository.save(brandCreator);
  }

  async editBrandUser(
    input: EditBrandUserInput,
    currentUser: UserEntity,
  ): Promise<UserEntity> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, UserEntity)) {
      throw new Error('You are not authorized to do this action!');
    }

    const brandCreator = await this.userRepository.findOne(input.id);
    if (!brandCreator || !isBrandUser(brandCreator)) {
      throw new Error('Could not find a brand user with this ID!');
    }

    const passwordHash = input.password ? await hash(input.password, 10) : null;

    brandCreator.email = input.email || brandCreator.email;
    brandCreator.firstName = input.firstName || brandCreator.firstName;
    brandCreator.lastName = input.lastName || brandCreator.lastName;
    brandCreator.passwordHash = passwordHash || brandCreator.passwordHash;
    brandCreator.phoneNumber = input.phoneNumber || brandCreator.phoneNumber;
    brandCreator.title = input.title || brandCreator.title;
    brandCreator.abilityType = input.abilityType || brandCreator.abilityType;

    await this.check(brandCreator);

    return this.userRepository.save(brandCreator);
  }

  async changeBrandUserType(
    input: ChangeBrandUserTypeInput,
    currentUser: UserEntity,
  ): Promise<UserEntity> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, UserEntity)) {
      throw new Error('You are not authorized to do this action!');
    }

    const brandCreator = await this.userRepository.findOne(input.id);
    if (!brandCreator || !isBrandUser(brandCreator)) {
      throw new Error('Could not find a brand user with this ID!');
    }

    brandCreator.abilityType = input.abilityType || brandCreator.abilityType;

    await this.check(brandCreator);

    return this.userRepository.save(brandCreator);
  }

  async deleteBrandUser(id: string, currentUser: UserEntity): Promise<string> {
    await this.userRepository.can(currentUser, CaslAction.MANAGE, UserEntity);

    const brandUser = await this.userRepository.findOne(id);
    if (!brandUser || !isBrandUser(brandUser)) {
      throw new Error('Could not find a brand user with this ID!');
    }

    const { affected } = await this.userRepository.delete(id);

    return affected == 1
      ? 'User Deleted Sucessfully!'
      : 'There is no user with this ID';
  }
}
