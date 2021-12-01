import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/common/casl/casl.module';
import { AccountModule } from 'src/core/account/account.module';
import { BadgeModule } from 'src/core/badge/badge.module';

import { BrandRepository } from './brand.repository';
import { BrandResolver } from './brand.resolver';
import { BrandService } from './brand.service';

@Module({
  providers: [BrandResolver, BrandService],
  imports: [
    AccountModule,
    BadgeModule,
    CaslModule,
    TypeOrmModule.forFeature([BrandRepository]),
  ],
  exports: [BrandService],
})
export class BrandModule {}
