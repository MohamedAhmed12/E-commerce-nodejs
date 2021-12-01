import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfirmableOperationFacade } from './confirmable-operation.facade';
import { ConfirmableOperationEntity } from './entity/confirmable-operation.entity';
import { ConfirmableOperationService } from './service/confirmable-operation.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConfirmableOperationEntity])],
  providers: [ConfirmableOperationFacade, ConfirmableOperationService],
  exports: [ConfirmableOperationFacade],
})
export class ConfirmableOperationModule {}
