import { DateTime } from 'luxon';

import { AbilityType } from 'src/graphql-types';

export type UserInfo = {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash?: string;
  emailConfirmedAt?: DateTime;
  abilityType: AbilityType;
};
