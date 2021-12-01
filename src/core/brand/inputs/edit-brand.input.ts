import { MinLength } from 'class-validator';

import { EditBrandInput as EditBrandRawInput } from 'src/graphql-types';

export class EditBrandInput extends EditBrandRawInput {
  id: string;

  @MinLength(1)
  name?: string;

  description?: string;
}
