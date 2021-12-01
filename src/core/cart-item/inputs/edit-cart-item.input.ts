import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { EditCartItemInput as EditCartItemRawInput } from 'src/graphql-types';

import { SizeIdWithQuantityInput } from './size-id-with-quantity.input';

export class EditCartItemInput extends EditCartItemRawInput {
  @IsNotEmpty()
  cartItemId: string;

  @IsOptional()
  @MinLength(1)
  productColorId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  sizeIdsWithQuantity?: SizeIdWithQuantityInput[];
}
