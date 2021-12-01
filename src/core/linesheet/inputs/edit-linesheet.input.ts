import { IsNotEmpty, MinLength, IsOptional } from 'class-validator';

import { EditLinesheetInput as EditLinesheetRawInput } from 'src/graphql-types';

export class EditLinesheetInput extends EditLinesheetRawInput {
  @IsNotEmpty()
  id: string;

  @MinLength(1)
  title?: string;

  @IsOptional()
  description?: string;
}
