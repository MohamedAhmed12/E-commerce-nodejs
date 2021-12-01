import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { hash } from 'bcrypt';

import { InvitationTokenService } from 'src/core/invitation-token/invitation-token.service';
import { ResetPasswordTokenService } from 'src/core/reset-password-token/reset-password-token.service';
import { UserService } from 'src/core/user/services/user.service';
import { UserEntity } from 'src/core/user/user.entity';
import {
  CustomResponseStatus,
  AuthResponse,
  CustomResponse,
} from 'src/graphql-types';

import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { TokenService } from './token.service';

@Resolver()
export class AuthResolver {
  constructor(
    private invitationTokenService: InvitationTokenService,
    private resetPasswordTokenService: ResetPasswordTokenService,
    private userService: UserService,
    private tokenService: TokenService,
    private authService: AuthService,
  ) {}

  @Mutation()
  async acceptInvite(
    @Args('inviteToken') inviteToken: string,
    @Args('password') password: string,
  ): Promise<AuthResponse> {
    const invitationToken =
      await this.invitationTokenService.findOneByTokenWithUser(inviteToken);

    if (invitationToken.acceptedAt) {
      throw new Error('The invitation token is not valid');
    }

    const passwordHash = await hash(password, 10);

    const { user } = invitationToken;

    const payload = await this.authService.createAccessAndRefreshTokens(
      user.id,
    );

    await this.userService.updatePasswordHashAndSetEmailConfirmed(
      user.id,
      passwordHash,
    );

    await this.invitationTokenService.setAccepted(invitationToken.id);

    return payload;
  }

  @Mutation()
  async signInWithEmail(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthResponse> {
    const user = await this.authService.validate(email, password);

    if (!user) {
      throw new Error('User is not valid');
    }

    return this.authService.createAccessAndRefreshTokens(user.id);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return this.userService.findOne(user.id);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async signOut(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CustomResponse> {
    return this.authService.signOut(currentUser);
  }

  @Mutation()
  async requestPasswordResetWithEmail(
    @Args('email') email: string,
  ): Promise<CustomResponse> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new Error('User is not valid');
    }

    if (!user.emailConfirmedAt) {
      throw new Error('The user did not accept the invitation');
    }

    const resetToken = await this.resetPasswordTokenService.create(user);

    await this.authService.sendResetPasswordLink(resetToken.token, user.email);

    return {
      message: 'requestPasswordResetWithEmail successful',
      status: CustomResponseStatus.OK,
    };
  }

  @Mutation()
  async finalizePasswordReset(
    @Args('token') token: string,
    @Args('password') password: string,
  ): Promise<AuthResponse> {
    const resetPasswordToken =
      await this.resetPasswordTokenService.findOneByTokenWithUser(token);

    if (resetPasswordToken.acceptedAt) {
      throw new Error('This token was used');
    }

    const passwordHash = await hash(password, 10);

    const { user } = resetPasswordToken;

    await this.tokenService.removeAllSessions(user.id);

    const payload = await this.authService.createAccessAndRefreshTokens(
      user.id,
    );

    await this.userService.updatePasswordHash(user.id, passwordHash);

    await this.resetPasswordTokenService.setAccepted(resetPasswordToken.id);

    return payload;
  }

  @Mutation()
  async refreshSession(
    @Args('refreshToken') refreshToken: string,
  ): Promise<AuthResponse> {
    const { user, token: session } =
      await this.tokenService.resolveRefreshToken(refreshToken);

    await this.tokenService.deleteSession(session.id);

    return this.authService.createAccessAndRefreshTokens(user.id);
  }
}
