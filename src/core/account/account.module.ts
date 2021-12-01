import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/common/casl/casl.module';
import { CartModule } from 'src/core/cart/cart.module';

import { AccountRepository } from './account.repository';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Module({
  providers: [AccountResolver, AccountService],
  imports: [
    CaslModule,
    CartModule,
    TypeOrmModule.forFeature([AccountRepository]),
  ],
  exports: [AccountService],
})
export class AccountModule {}
