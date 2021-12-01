import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';

import { AccountEntity } from '../../../src/core/account/account.entity';
import { BadgeEntity } from '../../../src/core/badge/badge.entity';
import { BrandEntity } from '../../../src/core/brand/brand.entity';
import { LinesheetEntity } from '../../../src/core/linesheet/linesheet.entity';
import { ProductCategoryEntity } from '../../../src/core/product-category/product-category.entity';
import { ProductSubCategoryEntity } from '../../../src/core/product-sub-category/product-sub-category.entity';
import { SizeChartEntity } from '../../../src/core/size-chart/size-chart.entity';
import { SizeEntity } from '../../../src/core/size/size.entity';
import { UserEntity } from '../../../src/core/user/user.entity';
import {
  AbilityType,
  AccountType,
  Currency,
  CustomResponseStatus,
  Product,
  ProductColor,
} from '../../../src/graphql-types';
import { initEndToEndTest } from '../../common/e2e-test';
import { AccountFactory } from '../../factories/account.factory';
import { AuthFactory } from '../../factories/auth.factory';
import { BadgFactory } from '../../factories/badg.factory';
import { BrandFactory } from '../../factories/brand.factory';
import { FavouriteBrandFactory } from '../../factories/favourite-brand.factory';
import { LinesheetFactory } from '../../factories/linesheet.factory';
import { ProductCategoryFactory } from '../../factories/product-category.factory';
import { ProductColorFactory } from '../../factories/product-color.factory';
import { ProductSubCategortFactory } from '../../factories/product-sub-categort.factory';
import { ProductFactory } from '../../factories/product.factory';
import { SizeChartFactory } from '../../factories/size-chart.factory';
import { SizeFactory } from '../../factories/size.factory';
import { UserFactory } from '../../factories/user.factory';

describe('Brand', () => {
  const context = initEndToEndTest();

  let account: AccountEntity;
  let accountShowroomA: AccountEntity;
  let accountShowroomB: AccountEntity;
  let accountRetailerA: AccountEntity;

  let brandUserA: UserEntity;
  let brandUserB: UserEntity;
  let retailerUserA: UserEntity;

  let brandUserAAccessToken: string;
  let brandUserBAccessToken: string;
  let retailerUserAAccessToken: string;

  let brand: BrandEntity;
  let publishBrandA: BrandEntity;
  let unPublishBrandB: BrandEntity;
  let publishBrandC: BrandEntity;
  let unPublishBrandD: BrandEntity;

  let badge: BadgeEntity;

  let productCategoryA: ProductCategoryEntity;
  let productSubCategoryA: ProductSubCategoryEntity;
  let productColor: ProductColor;
  let sizeChartA: SizeChartEntity;
  let sizeL: SizeEntity;

  beforeEach(async () => {
    account ||= await context.testingModule
      .get(AccountFactory)
      .create('Test Account', AccountType.SHOWROOM, context.systemManagerUser);

    accountShowroomA ||= await context.testingModule
      .get(AccountFactory)
      .create(
        'Account Showroom A',
        AccountType.SHOWROOM,
        context.systemManagerUser,
      );

    accountShowroomB ||= await context.testingModule
      .get(AccountFactory)
      .create(
        'Account Showroom B',
        AccountType.SHOWROOM,
        context.systemManagerUser,
      );

    accountRetailerA ||= await context.testingModule
      .get(AccountFactory)
      .create(
        'Account Retailer A',
        AccountType.RETAILER,
        context.systemManagerUser,
      );

    brandUserA ||= await context.testingModule.get(UserFactory).findOrCreate(
      {
        email: 'brandUserA@gmail.com',
        lastName: 'brandUserA',
        firstName: 'brandUserA',
        emailConfirmedAt: DateTime.local(),
        abilityType: AbilityType.ACCOUNT_MANAGER,
      },
      accountShowroomA,
    );

    brandUserAAccessToken ||= await context.testingModule
      .get(AuthFactory)
      .getAccessToken(brandUserA.id);

    brandUserB ||= await context.testingModule.get(UserFactory).findOrCreate(
      {
        email: 'brandUserB@gmail.com',
        lastName: 'brandUserB',
        firstName: 'brandUserB',
        emailConfirmedAt: DateTime.local(),
        abilityType: AbilityType.ACCOUNT_MANAGER,
      },
      accountShowroomB,
    );

    brandUserBAccessToken ||= await context.testingModule
      .get(AuthFactory)
      .getAccessToken(brandUserB.id);

    retailerUserA ||= await context.testingModule.get(UserFactory).findOrCreate(
      {
        email: 'retailerUserA@gmail.com',
        lastName: 'retailerUserA',
        firstName: 'retailerUserA',
        emailConfirmedAt: DateTime.local(),
        abilityType: AbilityType.ACCOUNT_MANAGER,
      },
      accountRetailerA,
    );

    retailerUserAAccessToken ||= await context.testingModule
      .get(AuthFactory)
      .getAccessToken(retailerUserA.id);

    publishBrandA ||= await context.testingModule.get(BrandFactory).create(
      {
        accountId: accountShowroomA.id,
        name: 'publishBrandA',
        description: 'publishBrandA',
      },
      brandUserA,
    );

    if (!publishBrandA.publishedAt) {
      publishBrandA = await context.testingModule
        .get(BrandFactory)
        .publishBrand(publishBrandA.id, context.systemManagerUser);
    }

    unPublishBrandB ||= await context.testingModule.get(BrandFactory).create(
      {
        accountId: accountShowroomA.id,
        name: 'unPublishBrandB',
        description: 'unPublishBrandB',
      },
      brandUserA,
    );

    publishBrandC ||= await context.testingModule.get(BrandFactory).create(
      {
        accountId: accountShowroomB.id,
        name: 'publishBrandC',
        description: 'publishBrandC',
      },
      brandUserB,
    );

    if (!publishBrandC.publishedAt) {
      publishBrandC = await context.testingModule
        .get(BrandFactory)
        .publishBrand(publishBrandC.id, context.systemManagerUser);
    }

    unPublishBrandD ||= await context.testingModule.get(BrandFactory).create(
      {
        accountId: accountShowroomB.id,
        name: 'unPublishBrandD',
        description: 'unPublishBrandD',
      },
      brandUserB,
    );

    brand ||= await context.testingModule.get(BrandFactory).create(
      {
        accountId: account.id,
        name: 'Test Brand',
        description: 'Test Description',
      },
      context.systemManagerUser,
    );

    badge = await context.testingModule.get(BadgFactory).findOrCreate('new');

    productCategoryA ||= await context.testingModule
      .get(ProductCategoryFactory)
      .create('productCategoryA');

    productSubCategoryA ||= await context.testingModule
      .get(ProductSubCategortFactory)
      .create('productSubCategoryA', productCategoryA);

    productColor ||= await context.testingModule
      .get(ProductColorFactory)
      .findOrCreate('black');

    sizeChartA ||= await context.testingModule
      .get(SizeChartFactory)
      .create('sizeChartA', productSubCategoryA);

    sizeL ||= await context.testingModule
      .get(SizeFactory)
      .create('L', sizeChartA);
  });

  describe('Create', () => {
    let retailerAccount1: AccountEntity;
    let brandAccount1: AccountEntity;

    let brandUser1: UserEntity;
    let retailerUser1: UserEntity;

    let brandUser1AccessToken: string;
    let retailerUser1AccessToken: string;

    beforeEach(async () => {
      retailerAccount1 ||= await context.testingModule
        .get(AccountFactory)
        .create(
          'retailerAccount1',
          AccountType.RETAILER,
          context.systemManagerUser,
        );

      brandAccount1 ||= await context.testingModule
        .get(AccountFactory)
        .create(
          'brandAccount1',
          AccountType.BRAND_ACCOUNT,
          context.systemManagerUser,
        );

      brandUser1 ||= await context.testingModule.get(UserFactory).findOrCreate(
        {
          email: 'brandUser1p@gmail.com',
          lastName: 'brandUser1',
          firstName: 'brandUser1',
          emailConfirmedAt: DateTime.local(),
          abilityType: AbilityType.ACCOUNT_MANAGER,
        },
        brandAccount1,
      );

      brandUser1AccessToken ||= await context.testingModule
        .get(AuthFactory)
        .getAccessToken(brandUser1.id);

      retailerUser1 ||= await context.testingModule
        .get(UserFactory)
        .findOrCreate(
          {
            email: 'retailerUser1p@gmail.com',
            lastName: 'retailerUser1',
            firstName: 'retailerUser1',
            emailConfirmedAt: DateTime.local(),
            abilityType: AbilityType.ACCOUNT_MANAGER,
          },
          retailerAccount1,
        );

      retailerUser1AccessToken ||= await context.testingModule
        .get(AuthFactory)
        .getAccessToken(retailerUser1.id);
    });

    it(`should not create brand, not authorized (retailer)`, (done) => {
      const brandName = 'Brand 1';

      const mutation = `mutation {
        createBrand(input: {
          accountId: "${brandAccount1.id}"
          name: "${brandName}"
        }) {
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        retailerUser1AccessToken,
      );
    });

    it(`should not create brand in retailer account`, (done) => {
      const brandName = 'Brand 1';

      const mutation = `mutation {
        createBrand(input: {
          accountId: "${retailerAccount1.id}"
          name: "${brandName}"
        }) {
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUser1AccessToken,
      );
    });

    it(`should not create brand with non exist account id`, (done) => {
      const brandName = 'Brand 1';
      const nonExistId = '3973088e-5f40-4aaf-82e6-2a9b487456e2';

      const mutation = `mutation {
        createBrand(input: {
          accountId: "${nonExistId}"
          name: "${brandName}"
        }) {
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUser1AccessToken,
      );
    });

    it(`should not create brand with empty name`, (done) => {
      const brandName = '';

      const mutation = `mutation {
        createBrand(input: {
          accountId: "${brandAccount1.id}"
          name: "${brandName}"
        }) {
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUser1AccessToken,
      );
    });

    it(`should create brand`, (done) => {
      const brandName = 'Brand 1';

      const mutation = `mutation {
        createBrand(input: {
          accountId: "${brandAccount1.id}"
          name: "${brandName}"
        }) {
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.createBrand).toEqual({
          name: brandName,
        });
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUser1AccessToken,
      );
    });

    it(`should not create brand in account with brand`, (done) => {
      const brandName = 'Brand 1';

      const mutation = `mutation {
        createBrand(input: {
          accountId: "${brandAccount1.id}"
          name: "${brandName}"
        }) {
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUser1AccessToken,
      );
    });
  });

  describe('Edit', () => {
    let retailerAccount1: AccountEntity;
    let brandAccount1: AccountEntity;
    let brandAccount2: AccountEntity;

    let brand1: BrandEntity;

    let brandUser1: UserEntity;
    let brandUser2: UserEntity;
    let retailerUser1: UserEntity;

    let brandUser1AccessToken: string;
    let brandUser2AccessToken: string;
    let retailerUser1AccessToken: string;

    beforeEach(async () => {
      retailerAccount1 ||= await context.testingModule
        .get(AccountFactory)
        .create(
          'retailerAccount1',
          AccountType.RETAILER,
          context.systemManagerUser,
        );

      brandAccount1 ||= await context.testingModule
        .get(AccountFactory)
        .create(
          'brandAccount1',
          AccountType.BRAND_ACCOUNT,
          context.systemManagerUser,
        );

      brandAccount2 ||= await context.testingModule
        .get(AccountFactory)
        .create(
          'brandAccount2',
          AccountType.BRAND_ACCOUNT,
          context.systemManagerUser,
        );

      brandUser1 ||= await context.testingModule.get(UserFactory).findOrCreate(
        {
          email: 'brandUser1o@gmail.com',
          lastName: 'brandUser1',
          firstName: 'brandUser1',
          emailConfirmedAt: DateTime.local(),
          abilityType: AbilityType.ACCOUNT_MANAGER,
        },
        brandAccount1,
      );

      brandUser1AccessToken ||= await context.testingModule
        .get(AuthFactory)
        .getAccessToken(brandUser1.id);

      brandUser2 ||= await context.testingModule.get(UserFactory).findOrCreate(
        {
          email: 'brandUser2o@gmail.com',
          lastName: 'brandUser2',
          firstName: 'brandUser2',
          emailConfirmedAt: DateTime.local(),
          abilityType: AbilityType.ACCOUNT_MANAGER,
        },
        brandAccount2,
      );

      brandUser2AccessToken ||= await context.testingModule
        .get(AuthFactory)
        .getAccessToken(brandUser2.id);

      retailerUser1 ||= await context.testingModule
        .get(UserFactory)
        .findOrCreate(
          {
            email: 'retailerUser1o@gmail.com',
            lastName: 'retailerUser1',
            firstName: 'retailerUser1',
            emailConfirmedAt: DateTime.local(),
            abilityType: AbilityType.ACCOUNT_MANAGER,
          },
          retailerAccount1,
        );

      retailerUser1AccessToken ||= await context.testingModule
        .get(AuthFactory)
        .getAccessToken(retailerUser1.id);

      brand1 ||= await context.testingModule.get(BrandFactory).create(
        {
          accountId: brandAccount1.id,
          name: 'brand1',
          description: 'brand1',
        },
        context.systemManagerUser,
      );
    });

    it(`should edit brand`, (done) => {
      const newBrandName = 'new Brand';

      const mutation = `mutation {
        editBrand(input: {
          id: "${brand1.id}"
          name: "${newBrandName}"
        }) {
          id
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.editBrand).toEqual({
          id: brand1.id,
          name: newBrandName,
        });
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUser1AccessToken,
      );
    });

    it(`should not edit not your brand`, (done) => {
      const newBrandName = 'new Brand';

      const mutation = `mutation {
        editBrand(input: {
          id: "${brand1.id}"
          name: "${newBrandName}"
        }) {
          id
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUser2AccessToken,
      );
    });

    it(`should not edit brand, not authorized (retailer)`, (done) => {
      const newBrandName = 'new Brand';

      const mutation = `mutation {
        editBrand(input: {
          id: "${brand1.id}"
          name: "${newBrandName}"
        }) {
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        retailerUser1AccessToken,
      );
    });

    it(`should not edit brand with non exist id`, (done) => {
      const newBrandName = 'new Brand';
      const nonExistId = '3973088e-5f40-4aaf-82e6-2a9b487456e2';

      const mutation = `mutation {
        editBrand(input: {
          id: "${nonExistId}"
          name: "${newBrandName}"
        }) {
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUser1AccessToken,
      );
    });

    it(`should not edit brand with empty name`, (done) => {
      const brandName = '';

      const mutation = `mutation {
        editBrand(input: {
          id: "${brand1.id}"
          name: "${brandName}"
        }) {
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUser1AccessToken,
      );
    });
  });

  describe('Get Brand', () => {
    it('should returns unpublished brand to systemUser', (done) => {
      const query = `{ brand(brandId: "${unPublishBrandB.id}") { id } }`;

      const expectFunction = (res) => {
        expect(res.body.data.brand).toEqual({ id: unPublishBrandB.id });
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    it('should not returns unpublished brand', (done) => {
      const query = `{ brand(brandId: "${unPublishBrandB.id}") { id } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it('should returns published brand', (done) => {
      const query = `{ brand(brandId: "${publishBrandA.id}") { id } }`;

      const expectFunction = (res) => {
        expect(res.body.data.brand).toEqual({ id: publishBrandA.id });
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAAccessToken,
      );

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );
    });

    it('should not returns brand with non exist brandId', (done) => {
      const nonExistBrandId = '96bee2d0-50ba-409d-9133-7915c09704a7';
      const query = `{ brand(brandId: "${nonExistBrandId}") { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });
  });

  describe('Get system Brands', () => {
    it('should returns system brands', (done) => {
      const query = '{ systemBrands { id } }';

      const expectFunction = (res) => {
        expect(res.body.data.systemBrands).toEqual(
          expect.arrayContaining([
            { id: brand.id },
            { id: publishBrandA.id },
            { id: unPublishBrandB.id },
            { id: publishBrandC.id },
            { id: unPublishBrandD.id },
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

    it('should returns system brands by accountId', (done) => {
      const query = `{ systemBrands(accountId: "${accountShowroomA.id}") { id } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemBrands).toEqual(
          expect.arrayContaining([
            { id: publishBrandA.id },
            { id: unPublishBrandB.id },
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

    it('should returns empty system brands by non-exist accountId', (done) => {
      const nonExistAccountId = 'e7492f12-6350-4297-b504-1634ff1b8d6e';

      const query = `{ systemBrands(accountId: "${nonExistAccountId}") { id } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemBrands).toEqual([]);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });

    it('should not returns system brands, not authorized', (done) => {
      const query = `{ systemBrands { id } }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAAccessToken,
      );

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );
    });
  });

  describe('Get my Brands', () => {
    it('should returns my brands', (done) => {
      const query = '{ myBrands { id } }';

      const expectFunction = (res) => {
        expect(res.body.data.myBrands).toEqual(
          expect.arrayContaining([
            { id: publishBrandA.id },
            { id: unPublishBrandB.id },
          ]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAAccessToken,
      );
    });

    it('should not returns my brands', (done) => {
      const query = '{ myBrands { id } }';

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });
  });

  describe('Get Brands', () => {
    it('should returns brands', (done) => {
      const query = '{ brands { id } }';

      const expectFunction = (res) => {
        expect(res.body.data.brands).toEqual(
          expect.arrayContaining([
            { id: publishBrandA.id },
            { id: publishBrandC.id },
          ]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAAccessToken,
      );
    });
  });

  describe('Get Favourite Brands', () => {
    let brandAccount1: AccountEntity;
    let brandAccount2: AccountEntity;

    let brandUser: UserEntity;
    let brandUserAccessToken: string;

    let brand: BrandEntity;
    let deactivatedBrand: BrandEntity;

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
          email: 'brandUser22@gmail.com',
          lastName: 'brandUser',
          firstName: 'brandUser',
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

      await context.testingModule
        .get(FavouriteBrandFactory)
        .create(brandUser, brand);

      deactivatedBrand ||= await context.testingModule.get(BrandFactory).create(
        {
          accountId: brandAccount2.id,
          name: 'unpublishedBrand',
        },
        context.systemManagerUser,
      );

      if (!deactivatedBrand.publishedAt) {
        deactivatedBrand = await context.testingModule
          .get(BrandFactory)
          .publishBrand(deactivatedBrand.id, context.systemManagerUser);
      }

      await context.testingModule
        .get(FavouriteBrandFactory)
        .create(brandUser, deactivatedBrand);

      await context.testingModule
        .get(BrandFactory)
        .deactivateBrand(deactivatedBrand.id, context.systemManagerUser);
    });

    it('should returns favourite brands without deactivatedBrands', (done) => {
      const query = `{ favouriteBrands { name } }`;
      const expectFunction = (res) => {
        expect(res.body.data.favouriteBrands).toEqual([
          {
            name: brand.name,
          },
        ]);
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

  describe('Assign badge to brand', () => {
    it('should assign badge to brand', (done) => {
      const mutation = `
        mutation {
          assignBadge(brandId: "${brand.id}", badgeId: "${badge.id}") { id, name }
        }`;

      const expectFunction = (res) => {
        expect(res.body.data.assignBadge).toEqual({
          id: brand.id,
          name: brand.name,
        });
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not assign badge to brand with invalid brandId', (done) => {
      const invalidBrandId = '3973088e-5f40-4aaf-82e6-2a9b487456e2';

      const mutation = `
        mutation {
          assignBadge(brandId: "${brand.id}", badgeId: "${invalidBrandId}") { name }
        }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not assign badge to brand with invalid badgeId', (done) => {
      const invalidBadgeId = '3973088e-5f40-4aaf-82e6-2a9b487456e2';

      const mutation = `
        mutation {
          assignBadge(brandId: "${brand.id}", badgeId: "${invalidBadgeId}") { name }
        }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not assign badge to brand, not authorized', (done) => {
      const mutation = `
        mutation {
          assignBadge(brandId: "${brand.id}", badgeId: "${badge.id}") { name }
        }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        retailerUserA,
      );

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        brandUserB,
      );
    });
  });

  describe('Publish', () => {
    let secondBrand: BrandEntity;

    beforeEach(async () => {
      secondBrand ||= await context.testingModule.get(BrandFactory).create(
        {
          accountId: account.id,
          name: 'Brand',
          description: 'Brand Description',
        },
        context.systemManagerUser,
      );
    });

    it(`should publish brand`, (done) => {
      const query = `mutation {
        publishBrand(brandId: "${secondBrand.id}") {
          id
          publishedAt
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.publishBrand.publishedAt).not.toEqual(undefined);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    it(`should not publish brand, not authorized`, (done) => {
      const query = `mutation {
        publishBrand(brandId: "${unPublishBrandB.id}") {
          id
          publishedAt
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAAccessToken,
      );
    });

    it(`should not publish published brand`, (done) => {
      const query = `mutation {
        publishBrand(brandId: "${secondBrand.id}") {
          id
          publishedAt
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    it(`send invalid brand id, should returns error`, (done) => {
      const query = `mutation {
        publishBrand(brandId: "cc5af538-f2bc-486e-a954-9089117b5f58") {
          id
          publishedAt
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });
  });

  describe('Deactivate', () => {
    let account1: AccountEntity;

    let brandUser1: UserEntity;
    let brandUser1AccessToken: string;

    let brand1: BrandEntity;
    let brand2: BrandEntity;

    let linesheet1: LinesheetEntity;
    let product1: Product;

    beforeEach(async () => {
      account1 ||= await context.testingModule
        .get(AccountFactory)
        .create('account1', AccountType.SHOWROOM, context.systemManagerUser);

      brandUser1 ||= await context.testingModule.get(UserFactory).findOrCreate(
        {
          email: 'brandUser1@gmail.com',
          lastName: 'brandUser1',
          firstName: 'brandUser1',
          emailConfirmedAt: DateTime.local(),
          abilityType: AbilityType.ACCOUNT_MANAGER,
        },
        account1,
      );

      brandUser1AccessToken ||= await context.testingModule
        .get(AuthFactory)
        .getAccessToken(brandUser1.id);

      brand1 ||= await context.testingModule.get(BrandFactory).create(
        {
          accountId: account1.id,
          name: 'brand1',
          description: 'Brand Description',
        },
        context.systemManagerUser,
      );

      brand2 ||= await context.testingModule.get(BrandFactory).create(
        {
          accountId: account1.id,
          name: 'brand2',
          description: 'Brand Description',
        },
        context.systemManagerUser,
      );

      linesheet1 ||= await context.testingModule
        .get(LinesheetFactory)
        .create(
          brand1.id,
          'linesheet1',
          'linesheet Description',
          context.systemManagerUser,
        );

      product1 ||= await context.testingModule.get(ProductFactory).create(
        {
          brandId: brand1.id,
          productSubCategoryId: productSubCategoryA.id,
          name: 'product1Input',
          referenceCode: 'Code',
          wholesalePrice: new BigNumber(10.3),
          retailPrice: new BigNumber(9.32),
          currency: Currency.USD,
          colorIds: [productColor.id],
          sizeChartId: sizeChartA.id,
          selectedSizesIds: [sizeL.id],
          previewImageId: 'previewImageId',
          imageIds: ['imageIds1', 'imageIds2'],
        },
        context.systemManagerUser,
      );
    });

    it('should returns all brands', (done) => {
      const query = `{ systemBrands(accountId: "${account1.id}") { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemBrands).toEqual(
          expect.arrayContaining([
            { name: brand1.name },
            { name: brand2.name },
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

    it(`should returns linesheets of activeBrand`, (done) => {
      const query = `{systemLinesheets(input: { brandId: "${brand1.id}" }) {
          title
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.systemLinesheets).toEqual(
          expect.arrayContaining([{ title: linesheet1.title }]),
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

    it('should returns products of activeBrand', (done) => {
      const query = `{ systemProducts(input: { brandId: "${brand1.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemProducts).toEqual(
          expect.arrayContaining([{ name: product1.name }]),
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

    it(`should deactivate brand`, (done) => {
      const query = `mutation {
        deactivateBrand(brandId: "${brand1.id}") {
          status
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.publishBrand).not.toEqual({
          status: CustomResponseStatus.OK,
        });
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUser1AccessToken,
      );
    });

    it('should returns brands without deactivated brand', (done) => {
      const query = `{ systemBrands(accountId: "${account1.id}") { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemBrands).toEqual(
          expect.arrayContaining([{ name: brand2.name }]),
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

    it(`should returns empty array of linesheets of deactivatedBrand`, (done) => {
      const query = `{systemLinesheets(input: { brandId: "${brand1.id}"}) {
          title
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.systemLinesheets).toEqual([]);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });

    it('should returns empty array of products of deactivatedBrand', (done) => {
      const query = `{ systemProducts(input: { brandId: "${brand1.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemProducts).toEqual([]);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });

    it(`should not deactivate brand, not authorized`, (done) => {
      const query = `mutation {
        deactivateBrand(brandId: "${brand2.id}") {
          status
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );
    });

    it(`should not deactivate brand with non exist brand id`, (done) => {
      const nonExistId = 'cc5af538-f2bc-486e-a954-9089117b5f58';

      const query = `mutation {
        deactivateBrand(brandId: "${nonExistId}") {
          status
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });
  });
});
