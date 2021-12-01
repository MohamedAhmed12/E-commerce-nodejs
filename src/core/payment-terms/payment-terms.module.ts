import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentTermsSeeder } from 'src/database/seeds/seeders/payment-terms.seeder';

import { PaymentTermRepository } from './payment-term.repository';
import { PaymentTermsResolver } from './payment-terms.resolver';
import { PaymentTermsService } from './payment-terms.service';

@Module({
  providers: [PaymentTermsService, PaymentTermsResolver, PaymentTermsSeeder],
  imports: [TypeOrmModule.forFeature([PaymentTermRepository])],
  exports: [PaymentTermsService, PaymentTermsSeeder],
})
export class PaymentTermsModule {}
