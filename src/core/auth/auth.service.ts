import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EmailMailingService } from 'src/common/email-mailing/email-mailing.service';
import { SessionService } from 'src/core/session/session.service';
import { UserService } from 'src/core/user/services/user.service';
import { UserEntity } from 'src/core/user/user.entity';
import {
  AuthResponse,
  CustomResponse,
  CustomResponseStatus,
} from 'src/graphql-types';

import { jwtConstants } from './constants';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private sessionService: SessionService,
    private tokenService: TokenService,
    private emailMailingService: EmailMailingService,
  ) {}

  async validate(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userService.findOneByEmail(email);

    const isValid = user
      ? await this.userService.validateCredentials(user, password)
      : false;

    return isValid ? user : null;
  }

  async sendResetPasswordLink(token: string, email: string) {
    await this.emailMailingService.sendResetPasswordEmail(email, token);
  }

  async createAccessAndRefreshTokens(userId: string): Promise<AuthResponse> {
    const session = await this.sessionService.create(
      userId,
      jwtConstants.expiresInRefreshToken,
    );

    const accessToken = await this.tokenService.generateToken(
      userId,
      jwtConstants.expiresInAccessToken,
      session.id,
    );

    const refreshToken = await this.tokenService.generateToken(
      userId,
      jwtConstants.expiresInRefreshToken,
      session.id,
    );

    return this.buildResponsePayload(accessToken, refreshToken);
  }

  private buildResponsePayload(
    accessToken: string,
    refreshToken: string,
  ): AuthResponse {
    return {
      jwt: {
        accessToken,
        refreshToken,
      },
    };
  }

  async signOut(currentUser: UserEntity): Promise<CustomResponse> {
    // ToDo: remove only current session
    await this.tokenService.removeAllSessions(currentUser.id);

    return {
      message: 'signOut successful',
      status: CustomResponseStatus.OK,
    };
  }
}
