import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { CreateCartItemInput as CreateCartItemRawInput } from 'src/graphql-types';

import { SizeIdWithQuantityInput } from './size-id-with-quantity.input';

export class CreateCartItemInput extends CreateCartItemRawInput {
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @MinLength(1)
  productColorId?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  sizeIdsWithQuantity: SizeIdWithQuantityInput[];
}
