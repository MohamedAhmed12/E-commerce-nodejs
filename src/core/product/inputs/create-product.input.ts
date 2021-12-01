import { BigNumber } from 'bignumber.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import {
  CreateProductImageInput,
  CreateProductInput as CreateProductRawInput,
} from 'src/graphql-types';

export class CreateProductInput extends CreateProductRawInput {
  @IsNotEmpty()
  brandId: string;

  @IsNotEmpty()
  productSubCategoryId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  referenceCode: string;

  wholesalePrice: BigNumber;

  retailPrice: BigNumber;

  @IsNotEmpty()
  currencyId: string;

  description?: string;

  material?: string;

  minQuantity?: number;

  @IsOptional()
  @ArrayMaxSize(5)
  tags?: string[];

  @ArrayMinSize(1)
  colorIds: string[];

  @IsNotEmpty()
  sizeChartId: string;

  @ArrayMinSize(1)
  selectedSizesIds: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  previewImages: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  images: CreateProductImageInput[];
}
