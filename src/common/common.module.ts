import { Module } from '@nestjs/common';

import { CaslModule } from './casl/casl.module';
import { EmailMailingModule } from './email-mailing/email-mailing.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [EmailMailingModule, CaslModule, S3Module],
  exports: [EmailMailingModule, CaslModule, S3Module],
})
export class CommonModule {}
