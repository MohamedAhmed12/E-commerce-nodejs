import { DateTime } from 'luxon';
import { FindOperator } from 'typeorm';

export class DateTimeValueTransformer {
  static from(value: any): DateTime {
    if (value === null || value === undefined) {
      return null;
    }
    const dateTime = DateTime.fromJSDate(value);

    if (!dateTime.isValid) {
      throw new Error(
        `invalid date time when reading from typeorm: ${dateTime.invalidReason}, ${dateTime.invalidExplanation}`,
      );
    }

    return dateTime;
  }
  static to(value: DateTime): any {
    if (value === null || value === undefined) {
      return null;
    }

    if (value instanceof FindOperator) {
      // TypeORM operator, e.g. IsNull()
      return value;
    }

    return value.toJSDate();
  }
}
