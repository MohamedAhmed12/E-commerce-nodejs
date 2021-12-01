import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

import { SizeIdWithQuantityInput as SizeIdWithQuantityRawInput } from 'src/graphql-types';

export class SizeIdWithQuantityInput extends SizeIdWithQuantityRawInput {
  @IsString()
  @IsNotEmpty()
  sizeId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}
