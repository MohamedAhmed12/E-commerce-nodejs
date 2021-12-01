import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { SessionEntity } from './session.entity';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  public async create(userId: string, ttl: number): Promise<SessionEntity> {
    const token = new SessionEntity();

    token.userId = userId;
    token.expiresAt = DateTime.local().plus({ millisecond: ttl });

    return this.sessionRepository.save(token);
  }

  async findTokenById(id: string): Promise<SessionEntity | null> {
    return this.sessionRepository.findOne(id);
  }

  async removeAllSessions(userId) {
    return this.sessionRepository.delete({
      userId,
    });
  }

  async delete(sessionId) {
    return this.sessionRepository.delete(sessionId);
  }
}
