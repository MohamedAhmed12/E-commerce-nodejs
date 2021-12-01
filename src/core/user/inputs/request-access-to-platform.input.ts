import {
  IsEmail,
  IsUrl,
  IsJSON,
  IsNotEmpty,
  IsMobilePhone,
} from 'class-validator';

import {
  AccountType,
  RequestAccessToPlatformInput as RequestAccessToPlatformRawInput,
} from 'src/graphql-types';

export class RequestAccessToPlatformInput extends RequestAccessToPlatformRawInput {
  accountType: AccountType;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsMobilePhone()
  phoneNumber?: string;

  @IsNotEmpty()
  country: string;

  @IsUrl()
  website: string;

  @IsJSON()
  dataField?: string;
}
