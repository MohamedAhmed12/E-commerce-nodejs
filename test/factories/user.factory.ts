import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

import { AccountEntity } from '../../src/core/account/account.entity';
import { AuthService } from '../../src/core/auth/auth.service';
import { ResetPasswordTokenService } from '../../src/core/reset-password-token/reset-password-token.service';
import { UserService } from '../../src/core/user/services/user.service';
import { UserEntity } from '../../src/core/user/user.entity';
import { UserRepository } from '../../src/core/user/user.repository';
import { UserInfo } from '../../src/core/user/user.types';

@Injectable()
export class UserFactory {
  constructor(
    private readonly userRepository: UserRepository,
    private userService: UserService,
    private authService: AuthService,
    private resetPasswordTokenService: ResetPasswordTokenService,
  ) {}

  async findOrCreate(
    userInfo: UserInfo,
    account: AccountEntity | null,
  ): Promise<UserEntity> {
    let user;

    if (account) {
      user = await this.userService.findOneByEmailAndAccountId(
        userInfo.email,
        account.id,
      );
    } else {
      user = await this.userService.findOneByEmail(userInfo.email);
    }

    if (user) {
      return user;
    }

    const createdUser = await this.userService.create(userInfo, account);

    return this.resetPassword(createdUser);
  }

  async resetPassword(user: UserEntity): Promise<UserEntity> {
    const resetToken = await this.resetPasswordTokenService.create(user);

    const passwordHash = await hash('testPassword', 10);

    await this.userService.updatePasswordHash(user.id, passwordHash);
    await this.resetPasswordTokenService.setAccepted(resetToken.id);

    return user;
  }
}
