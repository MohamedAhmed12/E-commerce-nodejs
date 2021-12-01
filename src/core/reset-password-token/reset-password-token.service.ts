import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { UserEntity } from 'src/core/user/user.entity';

import { ResetPasswordTokenEntity } from './reset-password-token.entity';
import { ResetPasswordTokenRepository } from './reset-password-token.repository';

@Injectable()
export class ResetPasswordTokenService {
  constructor(
    private readonly invitationTokenRepository: ResetPasswordTokenRepository,
  ) {}

  async create(user: UserEntity): Promise<ResetPasswordTokenEntity> {
    const token = new ResetPasswordTokenEntity();
    token.user = user;

    return this.invitationTokenRepository.save(token);
  }

  findOneByTokenWithUser(token: string): Promise<ResetPasswordTokenEntity> {
    return this.invitationTokenRepository.findOne({
      where: {
        token,
      },
      relations: ['user'],
    });
  }

  async setAccepted(id: string): Promise<ResetPasswordTokenEntity> {
    const token = await this.invitationTokenRepository.findOne(id);

    token.acceptedAt = DateTime.local();

    return this.invitationTokenRepository.save(token);
  }
}
