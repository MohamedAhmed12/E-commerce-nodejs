import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

import { EditAccountInput as EditAccountRawInput } from 'src/graphql-types';

export class EditAccountInput extends EditAccountRawInput {
  @IsNotEmpty()
  accountId: string;

  @IsOptional()
  @MinLength(1)
  name?: string;
}
