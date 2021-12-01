import { IsNotEmpty, Min } from 'class-validator';

import {
  CreateProductImageInput as CreateProductImageRawInput,
  ImageSrc,
} from 'src/graphql-types';

export class CreateProductImageInput extends CreateProductImageRawInput {
  @IsNotEmpty()
  src: ImageSrc;

  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  @Min(1)
  order: number;
}
