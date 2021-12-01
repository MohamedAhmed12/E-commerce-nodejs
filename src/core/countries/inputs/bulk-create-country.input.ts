import { IsNotEmpty, IsString } from 'class-validator';

import { BulkCreateCountryInput as BulkCreateCountryRawInput } from 'src/graphql-types';

export class BulkCreateCountryInput extends BulkCreateCountryRawInput {
  @IsString()
  @IsNotEmpty()
  name: string;
}
