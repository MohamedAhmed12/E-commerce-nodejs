import { BigNumber } from 'bignumber.js';

export class BigNumberValueTransformer {
  static from(value: any): BigNumber {
    if (value === null || value === undefined) {
      return null;
    }

    return new BigNumber(value);
  }

  static to(value: BigNumber): any {
    if (value === null || value === undefined) {
      return null;
    }

    return value.toNumber();
  }
}
