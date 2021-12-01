import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EmailMailingService } from 'src/common/email-mailing/email-mailing.service';
import { InvitationTokenModule } from 'src/core/invitation-token/invitation-token.module';
import { ResetPasswordTokenModule } from 'src/core/reset-password-token/reset-password-token.module';
import { SessionModule } from 'src/core/session/session.module';
import { UserModule } from 'src/core/user/user.module';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenService } from './token.service';

@Module({
  imports: [
    InvitationTokenModule,
    ResetPasswordTokenModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30h' },
    }),
    SessionModule,
    ConfigModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    TokenService,
    EmailMailingService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
