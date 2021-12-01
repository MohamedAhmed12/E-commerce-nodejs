import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { UserEntity } from 'src/core/user/user.entity';

import { InvitationTokenEntity } from './invitation-token.entity';
import { InvitationTokenRepository } from './invitation-token.repository';

@Injectable()
export class InvitationTokenService {
  constructor(
    private readonly invitationTokenRepository: InvitationTokenRepository,
  ) {}

  async create(user: UserEntity): Promise<InvitationTokenEntity> {
    const token = new InvitationTokenEntity();
    token.user = user;

    return this.invitationTokenRepository.save(token);
  }

  findOneByTokenWithUser(token: string): Promise<InvitationTokenEntity> {
    return this.invitationTokenRepository.findOne({
      where: {
        token,
      },
      relations: ['user'],
    });
  }

  async setAccepted(id: string): Promise<InvitationTokenEntity> {
    const token = await this.invitationTokenRepository.findOne(id);

    token.acceptedAt = DateTime.local();

    return this.invitationTokenRepository.save(token);
  }
}
