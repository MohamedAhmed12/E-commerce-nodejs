import { Injectable } from '@nestjs/common';

import { AuthService } from '../../src/core/auth/auth.service';

@Injectable()
export class AuthFactory {
  constructor(private authService: AuthService) {}

  async getAccessToken(userId: string): Promise<string> {
    const authResponse = await this.authService.createAccessAndRefreshTokens(
      userId,
    );

    return authResponse.jwt.accessToken;
  }
}
