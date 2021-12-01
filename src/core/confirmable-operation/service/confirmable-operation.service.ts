import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Connection, EntityManager, Repository } from 'typeorm';

import { ConfirmableOperationEntity } from '../entity/confirmable-operation.entity';
import { ConfirmableOperationNotFoundError } from '../errors/confirmable-operation-not-found.error';
import {
  ConfirmableOperationStatus,
  ConfirmationStatus,
} from '../model/confirmable-operation-status';

@Injectable()
export class ConfirmableOperationService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(ConfirmableOperationEntity)
    private readonly repository: Repository<ConfirmableOperationEntity>,
  ) {}

  async verifyEmailToken(token: string): Promise<ConfirmableOperationStatus> {
    const operation = await this.repository.findOne({
      where: { emailToken: token },
    });

    if (!operation) {
      throw new ConfirmableOperationNotFoundError();
    }

    return this.makeDto(operation);
  }

  async confirmEmailToken(token: string): Promise<ConfirmableOperationStatus> {
    return await this.connection.transaction(async (entityManager) => {
      const operation = await this.getOperationExclusivelyByEmailToken(
        token,
        entityManager,
      );

      if (operation.emailConfirmedAt) {
        throw new ConfirmableOperationNotFoundError();
      }

      operation.emailConfirmedAt = DateTime.local();
      const updatedOperation = await entityManager.save(operation);

      return this.makeDto(updatedOperation);
    });
  }

  async finalizeOperation(id: string, entityManager: EntityManager) {
    const operation = await this.getOperationExclusivelyById(id, entityManager);
    const now = DateTime.local();

    if (
      this.makeOperationStatus(operation, now) !== ConfirmationStatus.CONFIRMED
    ) {
      throw new ConfirmableOperationNotFoundError();
    }

    await entityManager.delete(ConfirmableOperationEntity, id);
  }

  private async getOperationExclusivelyById(
    id: string,
    entityManager: EntityManager,
  ): Promise<ConfirmableOperationEntity> {
    const operation = await entityManager.findOne(ConfirmableOperationEntity, {
      // TODO: short-uuid
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });
    if (!operation) {
      throw new ConfirmableOperationNotFoundError();
    }
    return operation;
  }

  private async getOperationExclusivelyByEmailToken(
    emailToken: string,
    entityManager: EntityManager,
  ): Promise<ConfirmableOperationEntity> {
    const operation = await entityManager.findOne(ConfirmableOperationEntity, {
      where: { emailToken },
      lock: { mode: 'pessimistic_write' },
    });
    if (!operation) {
      throw new ConfirmableOperationNotFoundError();
    }
    return operation;
  }

  private makeDto(
    operation: ConfirmableOperationEntity,
  ): ConfirmableOperationStatus {
    const now = DateTime.local();

    const status: ConfirmableOperationStatus = {
      operation: operation.operation,
      status: this.makeOperationStatus(operation, now),
    };

    if (status.status === ConfirmationStatus.CONFIRMED) {
      // TODO: short-uuid
      status.id = operation.id;
    }

    // if (operation.userId) {
    //   status.userId = operation.userId;
    // }

    if (operation.emailToken) {
      status.email = this.makeOperationSubStatus(
        operation.emailToken,
        operation.emailConfirmedAt,
        operation.expiresAt,
        now,
      );
    }

    return status;
  }

  private makeOperationStatus(
    operation: ConfirmableOperationEntity,
    now: DateTime,
  ): ConfirmationStatus {
    if (now >= operation.expiresAt) {
      return ConfirmationStatus.EXPIRED;
    }

    if (operation.emailToken && !operation.emailConfirmedAt) {
      return ConfirmationStatus.REQUIRED;
    }

    return ConfirmationStatus.CONFIRMED;
  }

  private makeOperationSubStatus(
    token: string,
    confirmedAt: DateTime,
    expiresAt: DateTime,
    now: DateTime,
  ): ConfirmationStatus {
    if (now >= expiresAt) {
      return ConfirmationStatus.EXPIRED;
    }

    return !token || confirmedAt
      ? ConfirmationStatus.CONFIRMED
      : ConfirmationStatus.REQUIRED;
  }

  createConfirmableOperation() {
    return undefined;
  }
}
