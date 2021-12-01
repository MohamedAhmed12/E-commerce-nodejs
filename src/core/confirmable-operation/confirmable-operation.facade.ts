import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { ConfirmableOperationStatus } from './model/confirmable-operation-status';
import { ConfirmableOperationService } from './service/confirmable-operation.service';

@Injectable()
export class ConfirmableOperationFacade {
  constructor(
    private readonly confirmableOperationService: ConfirmableOperationService,
  ) {}

  async createConfirmableOperation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    operation: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entityManager: EntityManager,
  ): Promise<ConfirmableOperationStatus> {
    return this.confirmableOperationService.createConfirmableOperation();
  }

  async verifyEmailToken(token: string): Promise<ConfirmableOperationStatus> {
    return this.confirmableOperationService.verifyEmailToken(token);
  }

  async confirmEmailToken(token: string): Promise<ConfirmableOperationStatus> {
    return this.confirmableOperationService.confirmEmailToken(token);
  }

  async finalizeOperation(id: string, entityManager: EntityManager) {
    return this.confirmableOperationService.finalizeOperation(
      id,
      entityManager,
    );
  }
}
