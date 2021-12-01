import { AbilityType } from 'src/graphql-types';

import { UserEntity } from './user.entity';

export const isSystemManager = (user: UserEntity) => {
  return AbilityType.SYSTEM_MANAGER === user.abilityType;
};

export const isSystemOperator = (user: UserEntity) => {
  return AbilityType.SYSTEM_OPERATOR === user.abilityType;
};

export const isSystemUser = (user: UserEntity) => {
  return isSystemManager(user) || isSystemOperator(user);
};

export const isBrandUser = (user: UserEntity) => {
  return isBrandAdmin(user) || isBrandCreator(user);
};

export const isBrandAdmin = (user: UserEntity) => {
  return AbilityType.BRAND_ADMIN === user.abilityType;
};

export const isBrandCreator = (user: UserEntity) => {
  return AbilityType.BRAND_CREATOR === user.abilityType;
};

export const isRetailerBuyer = (user: UserEntity) => {
  return AbilityType.RETAILER_BUYER === user.abilityType;
};
