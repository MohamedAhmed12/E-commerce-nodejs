export enum ConfirmationStatus {
  REQUIRED = 'REQUIRED',
  CONFIRMED = 'CONFIRMED',
  EXPIRED = 'EXPIRED',
}

export interface ConfirmableOperationStatus {
  /**
   * Populated only if operation is completed.
   */
  id?: string;

  /**
   * User id which initiated given operation.
   */
  userId?: string;

  /**
   * Type of the operation. From module perspective, this is a freeform text, but it should be meaningful
   * for a caller service.
   */
  operation: string;

  /**
   * General status of the operation.
   */
  status: ConfirmationStatus;

  /**
   * Individual sub-status of email confirmation.
   */
  email?: ConfirmationStatus;
}
