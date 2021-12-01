import { DateTime } from 'luxon';

import { AccountEntity } from '../../../src/core/account/account.entity';
import { BrandEntity } from '../../../src/core/brand/brand.entity';
import { UserEntity } from '../../../src/core/user/user.entity';
import {
  AbilityType,
  AccountType,
  CustomResponseStatus,
} from '../../../src/graphql-types';
import { initEndToEndTest } from '../../common/e2e-test';
import { AccountFactory } from '../../factories/account.factory';
import { AuthFactory } from '../../factories/auth.factory';
import { BrandFactory } from '../../factories/brand.factory';
import { UserFactory } from '../../factories/user.factory';

describe('FavouriteBrand', () => {
  const context = initEndToEndTest();

  describe('Create Favourite Brand', () => {
    let brandAccount1: AccountEntity;
    let brandAccount2: AccountEntity;

    let brandUser: UserEntity;
    let brandUserAccessToken: string;

    let brand: BrandEntity;
    let unpublishedBrand: BrandEntity;

    beforeEach(async () => {
      brandAccount1 ||= await context.testingModule
        .get(AccountFactory)
        .create(
          'Test Account',
          AccountType.BRAND_ACCOUNT,
          context.systemManagerUser,
        );

      brandAccount2 ||= await context.testingModule
        .get(AccountFactory)
        .create(
          'account2',
          AccountType.BRAND_ACCOUNT,
          context.systemManagerUser,
        );

      brandUser ||= await context.testingModule.get(UserFactory).findOrCreate(
        {
          email: 'test2User@gmail.com',
          lastName: 'lastName',
          firstName: 'firstName',
          emailConfirmedAt: DateTime.local(),
          abilityType: AbilityType.ACCOUNT_MANAGER,
        },
        brandAccount1,
      );

      brandUserAccessToken ||= await context.testingModule
        .get(AuthFactory)
        .getAccessToken(brandUser.id);

      brand ||= await context.testingModule.get(BrandFactory).create(
        {
          accountId: brandAccount1.id,
          name: 'My brand',
          description: 'My description',
        },
        context.systemManagerUser,
      );

      if (!brand.publishedAt) {
        brand = await context.testingModule
          .get(BrandFactory)
          .publishBrand(brand.id, context.systemManagerUser);
      }

      unpublishedBrand ||= await context.testingModule.get(BrandFactory).create(
        {
          accountId: brandAccount2.id,
          name: 'unpublishedBrand',
        },
        context.systemManagerUser,
      );
    });

    it('should create favourite brand', (done) => {
      const mutation = `mutation { createFavouriteBrand(brandId: "${brand.id}") { id, name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.createFavouriteBrand).toEqual({
          id: brand.id,
          name: brand.name,
        });
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUserAccessToken,
      );
    });

    it('should not create favourite brand with non exist brandId', (done) => {
      const nonExistId = '3973088e-5f40-4aaf-82e6-2a9b487456e2';
      const mutation = `mutation { createFavouriteBrand(brandId: "${nonExistId}") { id, name } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUserAccessToken,
      );
    });

    it('should not create favourite brand with unpublished brandId', (done) => {
      const mutation = `mutation { createFavouriteBrand(brandId: "${unpublishedBrand.id}") { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUserAccessToken,
      );
    });

    it('should not create favourite brand, not authorized (systemUser)', (done) => {
      const mutation = `mutation { createFavouriteBrand(brandId: "${brand.id}") { id, name } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });
  });

  describe('Remove Brand from Favourites', () => {
    let brandAccount: AccountEntity;

    let brandUser: UserEntity;
    let brandUserAccessToken: string;

    let brand: BrandEntity;

    beforeEach(async () => {
      brandAccount ||= await context.testingModule
        .get(AccountFactory)
        .create(
          'Test Account',
          AccountType.BRAND_ACCOUNT,
          context.systemManagerUser,
        );

      brandUser ||= await context.testingModule.get(UserFactory).findOrCreate(
        {
          email: 'test2UserU@gmail.com',
          lastName: 'lastName',
          firstName: 'firstName',
          emailConfirmedAt: DateTime.local(),
          abilityType: AbilityType.ACCOUNT_MANAGER,
        },
        brandAccount,
      );

      brandUserAccessToken ||= await context.testingModule
        .get(AuthFactory)
        .getAccessToken(brandUser.id);

      brand ||= await context.testingModule.get(BrandFactory).create(
        {
          accountId: brandAccount.id,
          name: 'My brand',
          description: 'My description',
        },
        context.systemManagerUser,
      );

      if (!brand.publishedAt) {
        brand = await context.testingModule
          .get(BrandFactory)
          .publishBrand(brand.id, context.systemManagerUser);
      }
    });

    it('should remove brand from favourites', (done) => {
      const mutation = `mutation { removeBrandFromFavourites(brandId: "${brand.id}") { status } }`;

      const expectFunction = (res) => {
        expect(res.body.data.removeBrandFromFavourites).toEqual({
          status: CustomResponseStatus.OK,
        });
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUserAccessToken,
      );
    });

    it('should not remove brand from favourites non exist brandId', (done) => {
      const nonExistId = '3973088e-5f40-4aaf-82e6-2a9b487456e2';
      const mutation = `mutation { createFavouriteBrand(brandId: "${nonExistId}") { id, name } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUserAccessToken,
      );
    });

    it('should not remove brand from favourites, not authorized (systemUser)', (done) => {
      const mutation = `mutation { removeBrandFromFavourites(brandId: "${brand.id}") { status } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });
  });
});
