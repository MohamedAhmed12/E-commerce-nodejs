import {
  IsEmail,
  IsIn,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

import {
  AbilityType,
  CreateBrandUserInput as CreateBrandUserRawInput,
} from 'src/graphql-types';

export class CreateBrandUserInput extends CreateBrandUserRawInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsOptional()
  @IsMobilePhone()
  phoneNumber?: string;

  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsIn([AbilityType.BRAND_ADMIN, AbilityType.BRAND_CREATOR])
  abilityType: AbilityType;
}
