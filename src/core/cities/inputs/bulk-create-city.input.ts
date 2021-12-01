import { IsNotEmpty, IsString } from 'class-validator';

import { BulkCreateCityInput as BulkCreateCityRawInput } from 'src/graphql-types';

export class BulkCreateCityInput extends BulkCreateCityRawInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  countryId: number;
}
