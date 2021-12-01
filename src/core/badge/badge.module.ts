import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BadgeRepository } from './badge.repository';
import { BadgeResolver } from './badge.resolver';
import { BadgeService } from './badge.service';

@Module({
  providers: [BadgeResolver, BadgeService],
  imports: [TypeOrmModule.forFeature([BadgeRepository])],
  exports: [BadgeService],
})
export class BadgeModule {}
