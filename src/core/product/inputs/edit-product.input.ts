import { BigNumber } from 'bignumber.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

import {
  CreateProductImageInput,
  EditProductInput as EditProductRawInput,
} from 'src/graphql-types';

export class EditProductInput extends EditProductRawInput {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @MinLength(1)
  productSubCategoryId?: string;

  @IsOptional()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @MinLength(1)
  referenceCode?: string;

  wholesalePrice?: BigNumber;

  retailPrice?: BigNumber;

  @IsNotEmpty()
  currencyId: string;

  description?: string;

  material?: string;

  minQuantity?: number;

  @IsOptional()
  @ArrayMaxSize(5)
  tags?: string[];

  @IsOptional()
  @ArrayMinSize(1)
  colorIds?: string[];

  @IsOptional()
  @MinLength(1)
  sizeChartId: string;

  @IsOptional()
  @ArrayMinSize(1)
  selectedSizesIds: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  previewImages: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  images: CreateProductImageInput[];
}
