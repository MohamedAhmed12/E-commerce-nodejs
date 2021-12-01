import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RetailerRepository } from './retailer.repository';
import { RetailersResolver } from './retailers.resolver';
import { RetailersService } from './retailers.service';

@Module({
  providers: [RetailersResolver, RetailersService],
  imports: [TypeOrmModule.forFeature([RetailerRepository])],
  exports: [RetailersService],
})
export class RetailersModule {}
