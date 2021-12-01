import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { validate } from 'class-validator';
import { DateTime } from 'luxon';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { CaslAction } from 'src/common/casl/casl.constants';
import { EmailMailingService } from 'src/common/email-mailing/email-mailing.service';
import { S3Service } from 'src/common/s3/s3.service';
import { AccountEntity } from 'src/core/account/account.entity';
import { AccountService } from 'src/core/account/account.service';
import { InvitationTokenService } from 'src/core/invitation-token/invitation-token.service';
import {
  EditProfileInput,
  InviteAdminInput,
  InviteUserToAccountInput,
  AbilityType,
  SystemUserInfo,
} from 'src/graphql-types';

import { RequestAccessToPlatformInput } from '../inputs/request-access-to-platform.input';
import { UserEntity } from '../user.entity';
import { UserRepository } from '../user.repository';
import { UserInfo } from '../user.types';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private invitationTokenService: InvitationTokenService,
    private emailMailingService: EmailMailingService,
    private accountService: AccountService,
    private caslAbilityFactory: CaslAbilityFactory,
    private s3Service: S3Service,
  ) {}

  async check(user: UserEntity) {
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    }
  }

  async create(
    userInfo: UserInfo,
    account: AccountEntity | null,
  ): Promise<UserEntity> {
    const user = new UserEntity();
    user.firstName = userInfo.firstName;
    user.lastName = userInfo.lastName;
    user.email = userInfo.email;
    user.abilityType = userInfo.abilityType;
    user.account = account;
    user.passwordHash = userInfo.passwordHash || null;
    user.emailConfirmedAt = userInfo?.emailConfirmedAt || null;

    await this.check(user);

    return this.userRepository.save(user);
  }

  findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne(userId);
    user.passwordHash = passwordHash;

    await this.check(user);

    return this.userRepository.save(user);
  }

  async updatePasswordHashAndSetEmailConfirmed(
    userId: string,
    passwordHash: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne(userId);
    user.passwordHash = passwordHash;
    user.emailConfirmedAt = DateTime.local();

    await this.check(user);

    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async findOneByEmailAndAccountId(
    email: string,
    accountId,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({
      email,
      account: {
        id: accountId,
      },
    });
  }

  public async validateCredentials(
    user: UserEntity,
    password: string,
  ): Promise<boolean> {
    return compare(password, user.passwordHash);
  }

  async inviteSystemUsers(
    input: InviteAdminInput[],
    currentUser: UserEntity,
  ): Promise<UserEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, UserEntity)) {
      throw new Error('You are not authorized to read products');
    }

    const users = await Promise.all(
      input.map(async (inputItem: InviteAdminInput) => {
        const user = await this.createAndInviteAdminUser(inputItem);

        return user;
      }),
    );

    return users;
  }

  async createAndInviteAdminUser(input: InviteAdminInput): Promise<UserEntity> {
    const user = await this.create(input, null);
    const invitationToken = await this.invitationTokenService.create(user);

    await this.emailMailingService.sendInviteEmail(
      user.email,
      invitationToken.token,
    );

    return user;
  }

  async inviteUsersToAccount(
    input: InviteUserToAccountInput[],
  ): Promise<UserEntity[]> {
    const users = await Promise.all(
      input.map(async (inputItem: InviteUserToAccountInput) => {
        const user = await this.createAndInviteUserToAccount(inputItem);

        return user;
      }),
    );

    return users;
  }

  async createAndInviteUserToAccount(
    input: InviteUserToAccountInput,
  ): Promise<UserEntity> {
    const { accountId, ...userInfo } = input;

    if (
      ![AbilityType.ACCOUNT_MANAGER, AbilityType.ACCOUNT_OPERATOR].includes(
        userInfo.abilityType,
      )
    ) {
      throw new Error('AbilityType is not correct');
    }

    const account = await this.accountService.findOneOrThrowError(accountId);

    let user = await this.findOneByEmail(userInfo.email);

    if (user) {
      throw new Error(
        'This user is already in the account, you cannot invite him to another account',
      );
    } else {
      user = await this.create(userInfo, account);
    }

    const invitationToken = await this.invitationTokenService.create(user);

    await this.emailMailingService.sendInviteEmail(
      user.email,
      invitationToken.token,
    );

    return user;
  }

  async createOrFindSystemUser(userInfo: SystemUserInfo) {
    const user = await this.findOneByEmail(userInfo.email);
    const passwordHash = await hash(userInfo.password || '123456789', 10);

    if (!user) {
      const userEntity: UserInfo = {
        email: userInfo.email,
        firstName: userInfo.firstName || 'Admin',
        lastName: userInfo.lastName || 'Admin',
        passwordHash,
        emailConfirmedAt: DateTime.local(),
        abilityType: userInfo.abilityType || AbilityType.SYSTEM_MANAGER,
      };

      return this.create(userEntity, null);
    }

    return user;
  }

  async editProfile(
    input: EditProfileInput,
    userId: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne(userId);

    user.firstName = input.firstName || user.firstName;
    user.lastName = input.lastName || user.lastName;
    user.phoneNumber = input.phoneNumber || user.phoneNumber;
    user.title = input.title || user.title;

    await this.check(user);

    return this.userRepository.save(user);
  }

  async findUsersByAccountId(accountId: string): Promise<UserEntity[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.account', 'account')
      .where('account.id = :accountId', { accountId })
      .getMany();
  }

  async findByAbilityTypes(abilityTypes: AbilityType[]): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.abilityType IN (:...abilityTypes)', { abilityTypes })
      .where('user.emailConfirmedAt is not null')
      .getMany();
  }

  async requestAccessToPlatform(input: RequestAccessToPlatformInput) {
    const systemUsers = await this.findByAbilityTypes([
      AbilityType.SYSTEM_MANAGER,
      AbilityType.SYSTEM_OPERATOR,
    ]);

    await Promise.all(
      systemUsers.map((user) =>
        this.emailMailingService.requestAccessToPlatform(user.email, input),
      ),
    );
  }

  // async getAssetUploadUrlAndKey() {
  //   return this.s3Service.getSignedUrlAndKey();
  // }
}
