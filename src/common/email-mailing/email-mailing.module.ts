import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailMailingService } from './email-mailing.service';

@Module({
  providers: [EmailMailingService],
  imports: [ConfigModule],
  exports: [EmailMailingService],
})
export class EmailMailingModule {}
