import { IsNotEmpty } from 'class-validator';

import { AddSizeToSizeChartInput as AddSizeToSizeChartRawInput } from 'src/graphql-types';

export class AddSizeToSizeChartInput extends AddSizeToSizeChartRawInput {
  @IsNotEmpty()
  sizeChartId: string;

  @IsNotEmpty()
  sizeName: string;
}
