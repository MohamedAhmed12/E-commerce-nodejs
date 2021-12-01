import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SizeRepository } from './size.repository';
import { SizeService } from './size.service';

@Module({
  providers: [SizeService],
  imports: [TypeOrmModule.forFeature([SizeRepository])],
  exports: [SizeService],
})
export class SizeModule {}
