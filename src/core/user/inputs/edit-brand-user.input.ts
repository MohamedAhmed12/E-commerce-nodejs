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
  EditBrandUserInput as EditBrandUserRawInput,
} from 'src/graphql-types';

export class EditBrandUserInput extends EditBrandUserRawInput {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  @Length(8)
  password: string;

  @IsOptional()
  @IsMobilePhone()
  phoneNumber: string;

  @IsOptional()
  title: string;

  @IsOptional()
  @IsIn([AbilityType.BRAND_ADMIN, AbilityType.BRAND_CREATOR])
  abilityType: AbilityType;
}
