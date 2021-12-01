import { AppError } from '../../../errors/app-error';
import { ErrorCode } from '../../../errors/error-code';

export class ConfirmableOperationNotFoundError extends AppError {
  constructor() {
    super('confirmable operation not found', ErrorCode.NOT_FOUND);
    Object.setPrototypeOf(this, ConfirmableOperationNotFoundError.prototype);
  }
}
