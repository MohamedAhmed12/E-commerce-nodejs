import { IsNotEmpty, IsOptional } from 'class-validator';

import { CreateBrandInput as CreateBrandRawInput } from 'src/graphql-types';

export class CreateBrandInput extends CreateBrandRawInput {
  @IsNotEmpty()
  accountId: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;
}
