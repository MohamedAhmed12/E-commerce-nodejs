import { join } from 'path';

import { GraphQLDefinitionsFactory } from '@nestjs/graphql';

const watch = process.argv.some((arg) => arg === '--watch');

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql-types.ts'),
  watch,
  outputAs: 'class',
  customScalarTypeMapping: {
    BigNumber: '_BigNumber',
  },
  additionalHeader: "import _BigNumber from 'bignumber.js'",
});
