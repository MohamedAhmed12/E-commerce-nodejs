import { ArrayMinSize, IsNotEmpty } from 'class-validator';

import { CreateSizeChartInput as CreateSizeChartRawInput } from 'src/graphql-types';

export class CreateSizeChartInput extends CreateSizeChartRawInput {
  @IsNotEmpty()
  subCategoryId: string;

  @IsNotEmpty()
  sizeChartName: string;

  @ArrayMinSize(1)
  sizes: string[];
}
