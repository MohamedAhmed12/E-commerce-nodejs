import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/common/casl/casl.module';
import { PersonalNotificationModule } from 'src/core/personal-notification/personal-notification.module';
import { UserModule } from 'src/core/user/user.module';

import { NotificationRepository } from './notification.repository';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService, NotificationResolver],
  imports: [
    UserModule,
    CaslModule,
    PersonalNotificationModule,
    TypeOrmModule.forFeature([NotificationRepository]),
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
