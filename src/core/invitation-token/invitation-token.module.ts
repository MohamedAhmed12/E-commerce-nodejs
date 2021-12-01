import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvitationTokenRepository } from './invitation-token.repository';
import { InvitationTokenService } from './invitation-token.service';

@Module({
  providers: [InvitationTokenService],
  imports: [TypeOrmModule.forFeature([InvitationTokenRepository])],
  exports: [InvitationTokenService],
})
export class InvitationTokenModule {}
