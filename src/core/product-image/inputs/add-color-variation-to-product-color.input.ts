import { IsNotEmpty } from 'class-validator';

import { AddColorVariationToProductImageInput as AddColorVariationToProductImageRawInput } from 'src/graphql-types';

export class AddColorVariationToProductImageInput extends AddColorVariationToProductImageRawInput {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  colorHex: string;

  @IsNotEmpty()
  colorId: string;
}
