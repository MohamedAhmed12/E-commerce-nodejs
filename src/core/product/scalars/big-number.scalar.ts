import { CustomScalar, Scalar } from '@nestjs/graphql';
import { BigNumber } from 'bignumber.js';
import { Kind, ValueNode } from 'graphql';

@Scalar('BigNumber')
export class BigNumberScalar implements CustomScalar<number, BigNumber> {
  description = 'Date custom scalar type';

  parseValue(value: number): BigNumber {
    return new BigNumber(value);
  }

  serialize(value: BigNumber): number {
    return value.toNumber();
  }

  parseLiteral(ast: ValueNode): BigNumber {
    if (ast.kind === Kind.FLOAT) {
      return new BigNumber(ast.value);
    }
    return null;
  }
}
