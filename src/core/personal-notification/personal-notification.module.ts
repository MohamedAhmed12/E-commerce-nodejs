import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/common/casl/casl.module';

import { PersonalNotificationRepository } from './personal-notification.repository';
import { PersonalNotificationResolver } from './personal-notification.resolver';
import { PersonalNotificationService } from './personal-notification.service';

@Module({
  providers: [PersonalNotificationService, PersonalNotificationResolver],
  imports: [
    CaslModule,
    TypeOrmModule.forFeature([PersonalNotificationRepository]),
  ],
  exports: [PersonalNotificationService],
})
export class PersonalNotificationModule {}
