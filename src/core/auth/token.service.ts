import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';

import { SessionEntity } from 'src/core/session/session.entity';
import { SessionService } from 'src/core/session/session.service';
import { UserService } from 'src/core/user/services/user.service';
import { UserEntity } from 'src/core/user/user.entity';

import { jwtConstants } from './constants';

const BASE_OPTIONS: SignOptions = {
  issuer: 'http://localhost:8080/',
  audience: 'http://localhost:8080/',
  // ToDo: use variable
};

export interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

@Injectable()
export class TokenService {
  public constructor(
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async generateAccessToken(
    userId: string,
    sessionId: string,
  ): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn: jwtConstants.expiresInAccessToken,
      subject: userId,
      jwtid: sessionId,
    };

    return this.jwtService.signAsync({}, opts);
  }

  public async generateToken(
    userId: string,
    expiresIn: number,
    sessionId: string,
  ): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: userId,
      jwtid: sessionId,
    };

    return this.jwtService.signAsync({}, opts);
  }

  public async resolveRefreshToken(
    refreshToken: string,
  ): Promise<{ user: UserEntity; token: SessionEntity }> {
    const payload = await this.decodeRefreshToken(refreshToken);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return { user, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<UserEntity> {
    const userId = payload.sub;

    if (!userId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.userService.findOne(userId);
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload?: RefreshTokenPayload,
  ): Promise<SessionEntity | null> {
    if (!payload.jti) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.sessionService.findTokenById(payload.jti);
  }

  async removeAllSessions(userId: string) {
    await this.sessionService.removeAllSessions(userId);
  }

  async deleteSession(sessionId: string) {
    await this.sessionService.delete(sessionId);
  }
}
