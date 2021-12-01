import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Module({
  providers: [SessionService],
  imports: [TypeOrmModule.forFeature([SessionRepository])],
  exports: [SessionService],
})
export class SessionModule {}
