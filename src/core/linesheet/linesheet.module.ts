import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/common/casl/casl.module';
import { BrandModule } from 'src/core/brand/brand.module';

import { LinesheetRepository } from './linesheet.repository';
import { LinesheetResolver } from './linesheet.resolver';
import { LinesheetService } from './linesheet.service';

@Module({
  providers: [LinesheetService, LinesheetResolver],
  imports: [
    CaslModule,
    BrandModule,
    TypeOrmModule.forFeature([LinesheetRepository]),
  ],
  exports: [LinesheetService],
})
export class LinesheetModule {}
