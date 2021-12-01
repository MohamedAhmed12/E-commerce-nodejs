import { DateTime } from 'luxon';

import { AccountEntity } from '../../../src/core/account/account.entity';
import { UserEntity } from '../../../src/core/user/user.entity';
import { AbilityType, AccountType } from '../../../src/graphql-types';
import { initEndToEndTest } from '../../common/e2e-test';
import { AccountFactory } from '../../factories/account.factory';
import { AuthFactory } from '../../factories/auth.factory';
import { UserFactory } from '../../factories/user.factory';

describe('Account', () => {
  const context = initEndToEndTest();

  let accountBrand: AccountEntity;
  let accountRetailer: AccountEntity;

  let brandUser: UserEntity;
  let retailerUser: UserEntity;

  let brandUserAccessToken: string;
  let retailerUserAccessToken: string;

  beforeEach(async () => {
    accountBrand ||= await context.testingModule
      .get(AccountFactory)
      .create(
        'accountBrand',
        AccountType.BRAND_ACCOUNT,
        context.systemManagerUser,
      );

    accountRetailer ||= await context.testingModule
      .get(AccountFactory)
      .create(
        'accountRetailer',
        AccountType.RETAILER,
        context.systemManagerUser,
      );

    brandUser ||= await context.testingModule.get(UserFactory).findOrCreate(
      {
        email: 'brandUser@gmail.com',
        lastName: 'brandUser',
        firstName: 'brandUser',
        emailConfirmedAt: DateTime.local(),
        abilityType: AbilityType.ACCOUNT_MANAGER,
      },
      accountBrand,
    );

    brandUserAccessToken ||= await context.testingModule
      .get(AuthFactory)
      .getAccessToken(brandUser.id);

    retailerUser ||= await context.testingModule.get(UserFactory).findOrCreate(
      {
        email: 'retailerUser@gmail.com',
        lastName: 'retailerUser',
        firstName: 'retailerUser',
        emailConfirmedAt: DateTime.local(),
        abilityType: AbilityType.ACCOUNT_MANAGER,
      },
      accountRetailer,
    );

    retailerUserAccessToken ||= await context.testingModule
      .get(AuthFactory)
      .getAccessToken(retailerUser.id);
  });

  describe('Create Account', () => {
    it('should create account', (done) => {
      const accountName = 'Account name';
      const mutation = `mutation { createAccount(name: "${accountName}", type: BRAND_ACCOUNT) { name, type } }`;

      const expectFunction = (res) => {
        expect(res.body.data.createAccount).toEqual({
          name: accountName,
          type: 'BRAND_ACCOUNT',
        });
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should create account without cart', (done) => {
      const accountName = 'Account name';
      const mutation = `mutation {
        createAccount(
          name: "${accountName}",
          type: BRAND_ACCOUNT,
          ) {
          id
          name
          type
          cart {
            id
          }
        }
    }`;

      const expectFunction = (res) => {
        expect(res.body.data.createAccount.cart).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should create account wit cart', (done) => {
      const accountName = 'Account name';
      const mutation = `mutation {
        createAccount(
          name: "${accountName}",
          type: RETAILER,
          ) {
          id
          name
          type
          cart {
            id
          }
        }
    }`;

      const expectFunction = (res) => {
        expect(res.body.data.createAccount.cart).not.toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });
  });

  describe('Get MyAccount', () => {
    it('should returns account', (done) => {
      const query = `{ myAccount { name, type } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myAccount).toEqual({
          name: accountBrand.name,
          type: accountBrand.type,
        });
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAccessToken,
      );
    });

    it('should not returns account, not authorized (systemUser)', (done) => {
      const query = `{ myAccount { name, type } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });
  });

  describe('Get SystemAccount', () => {
    it('should returns account', (done) => {
      const query = `{ systemAccount(accountId: "${accountBrand.id}") { name, type } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemAccount).toEqual({
          name: accountBrand.name,
          type: accountBrand.type,
        });
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });

    it('should not returns account, not authorized (retailerUser)', (done) => {
      const query = `{ systemAccount(accountId: "${accountBrand.id}") { name, type } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAccessToken,
      );
    });
  });

  describe('Get SystemAccounts', () => {
    it('should returns accounts', (done) => {
      const query = `{ systemAccounts { name, type } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemAccounts).toEqual(
          expect.arrayContaining([
            {
              name: accountBrand.name,
              type: accountBrand.type,
            },
            {
              name: accountRetailer.name,
              type: accountRetailer.type,
            },
          ]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });

    it('should returns accounts, filtered by type', (done) => {
      const query = `{ systemAccounts(input: { type: RETAILER }) { name, type } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemAccounts).toEqual(
          expect.arrayContaining([
            {
              name: accountRetailer.name,
              type: accountRetailer.type,
            },
          ]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });

    it('should not returns accounts, not authorized (brandUser)', (done) => {
      const query = `{ systemAccounts { name, type } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAccessToken,
      );
    });
  });
});
