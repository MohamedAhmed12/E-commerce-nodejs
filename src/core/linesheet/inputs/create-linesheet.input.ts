import { IsNotEmpty } from 'class-validator';

import { CreateLinesheetInput as CreateLinesheetRawInput } from 'src/graphql-types';

export class CreateLinesheetInput extends CreateLinesheetRawInput {
  @IsNotEmpty()
  brandId: string;

  @IsNotEmpty()
  title: string;

  description?: string;
}
