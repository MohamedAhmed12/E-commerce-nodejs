import { IsIn, IsNotEmpty } from 'class-validator';

import {
  AbilityType,
  ChangeBrandUserTypeInput as ChangeBrandUserTypeRawInput,
} from 'src/graphql-types';

export class ChangeBrandUserTypeInput extends ChangeBrandUserTypeRawInput {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsIn([AbilityType.BRAND_ADMIN, AbilityType.BRAND_CREATOR])
  abilityType: AbilityType;
}
