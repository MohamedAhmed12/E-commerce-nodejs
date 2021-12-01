import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShippingTermsSeeder } from 'src/database/seeds/seeders/shipping-terms.seeder';

import { ShippingTermRepository } from './shipping-term.repository';
import { ShippingTermsResolver } from './shipping-terms.resolver';
import { ShippingTermsService } from './shipping-terms.service';

@Module({
  providers: [ShippingTermsService, ShippingTermsResolver, ShippingTermsSeeder],
  imports: [TypeOrmModule.forFeature([ShippingTermRepository])],
  exports: [ShippingTermsService, ShippingTermsSeeder],
})
export class ShippingTermsModule {}
