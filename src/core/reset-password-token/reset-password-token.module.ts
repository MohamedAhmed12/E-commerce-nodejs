import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResetPasswordTokenRepository } from './reset-password-token.repository';
import { ResetPasswordTokenService } from './reset-password-token.service';

@Module({
  providers: [ResetPasswordTokenService],
  imports: [TypeOrmModule.forFeature([ResetPasswordTokenRepository])],
  exports: [ResetPasswordTokenService],
})
export class ResetPasswordTokenModule {}
