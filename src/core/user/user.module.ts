import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/common/casl/casl.module';
import { EmailMailingModule } from 'src/common/email-mailing/email-mailing.module';
import { S3Module } from 'src/common/s3/s3.module';
import { AccountModule } from 'src/core/account/account.module';
import { InvitationTokenModule } from 'src/core/invitation-token/invitation-token.module';
import { UsersSeeder } from 'src/database/seeds/seeders/users.seeder';

import { BrandAdminResolver } from './resolvers/brand-admin.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { BrandAdminService } from './services/brand-admin.service';
import { UserService } from './services/user.service';
import { UserRepository } from './user.repository';

@Module({
  providers: [
    UserResolver,
    UserService,
    UsersSeeder,
    BrandAdminResolver,
    BrandAdminService,
  ],
  imports: [
    InvitationTokenModule,
    EmailMailingModule,
    AccountModule,
    CaslModule,
    S3Module,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  exports: [UserService, UsersSeeder],
})
export class UserModule {}
