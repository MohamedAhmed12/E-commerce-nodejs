import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';

import { AccountEntity } from '../../../src/core/account/account.entity';
import { BrandEntity } from '../../../src/core/brand/brand.entity';
import { LinesheetEntity } from '../../../src/core/linesheet/linesheet.entity';
import { ProductCategoryEntity } from '../../../src/core/product-category/product-category.entity';
import { ProductColorEntity } from '../../../src/core/product-color/product-color.entity';
import { ProductSubCategoryEntity } from '../../../src/core/product-sub-category/product-sub-category.entity';
import { SizeChartEntity } from '../../../src/core/size-chart/size-chart.entity';
import { SizeEntity } from '../../../src/core/size/size.entity';
import { UserEntity } from '../../../src/core/user/user.entity';
import {
  AbilityType,
  AccountType,
  Currency,
  Product,
} from '../../../src/graphql-types';
import { initEndToEndTest } from '../../common/e2e-test';
import { AccountFactory } from '../../factories/account.factory';
import { AuthFactory } from '../../factories/auth.factory';
import { BrandFactory } from '../../factories/brand.factory';
import { LinesheetFactory } from '../../factories/linesheet.factory';
import { ProductCategoryFactory } from '../../factories/product-category.factory';
import { ProductColorFactory } from '../../factories/product-color.factory';
import { ProductSubCategortFactory } from '../../factories/product-sub-categort.factory';
import { ProductFactory } from '../../factories/product.factory';
import { SizeChartFactory } from '../../factories/size-chart.factory';
import { SizeFactory } from '../../factories/size.factory';
import { UserFactory } from '../../factories/user.factory';

describe('Linesheet', () => {
  const context = initEndToEndTest();

  let account: AccountEntity;

  let productCategory: ProductCategoryEntity;
  let productSubCategory: ProductSubCategoryEntity;

  let accountShowroomA: AccountEntity;
  let accountShowroomB: AccountEntity;
  let accountRetailerA: AccountEntity;

  let brandUserA: UserEntity;
  let brandUserB: UserEntity;
  let retailerUserA: UserEntity;

  let brandUserAAccessToken: string;
  let brandUserBAccessToken: string;
  let retailerUserAAccessToken: string;

  let publishBrandA: BrandEntity;
  let unPublishBrandB: BrandEntity;
  let publishBrandC: BrandEntity;
  let unPublishBrandD: BrandEntity;

  let publishLinesheetA: LinesheetEntity;
  let unPublishLinesheetB: LinesheetEntity;
  let unPublishLinesheetC: LinesheetEntity;
  let publishLinesheetD: LinesheetEntity;
  let unPublishLinesheetE: LinesheetEntity;

  let productA: Product;
  let productB: Product;
  let productC: Product;

  let productColor: ProductColorEntity;

  let sizeChart: SizeChartEntity;
  let sizeS: SizeEntity;

  beforeEach(async () => {
    account = await context.testingModule
      .get(AccountFactory)
      .create('Test Account', AccountType.SHOWROOM, context.systemManagerUser);

    productCategory ||= await context.testingModule
      .get(ProductCategoryFactory)
      .create('ready_to_wear');

    productSubCategory ||= await context.testingModule
      .get(ProductSubCategortFactory)
      .create('dresses', productCategory);

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

    publishLinesheetA ||= await context.testingModule
      .get(LinesheetFactory)
      .create(
        publishBrandA.id,
        'publishLinesheetA',
        'publishLinesheetA',
        brandUserA,
      );

    unPublishLinesheetB ||= await context.testingModule
      .get(LinesheetFactory)
      .create(
        publishBrandA.id,
        'unPublishLinesheetB',
        'unPublishLinesheetB',
        brandUserA,
      );

    unPublishLinesheetC ||= await context.testingModule
      .get(LinesheetFactory)
      .create(
        unPublishBrandB.id,
        'unPublishLinesheetC',
        'unPublishLinesheetC',
        brandUserA,
      );

    publishLinesheetD ||= await context.testingModule
      .get(LinesheetFactory)
      .create(
        publishBrandC.id,
        'publishLinesheetD',
        'publishLinesheetD',
        brandUserB,
      );

    unPublishLinesheetE ||= await context.testingModule
      .get(LinesheetFactory)
      .create(
        publishBrandC.id,
        'unPublishLinesheetE',
        'unPublishLinesheetE',
        brandUserB,
      );

    productColor ||= await context.testingModule
      .get(ProductColorFactory)
      .findOrCreate('black');

    sizeChart ||= await context.testingModule
      .get(SizeChartFactory)
      .create('general', productSubCategory);

    sizeS ||= await context.testingModule
      .get(SizeFactory)
      .create('S', sizeChart);

    productA ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandA.id,
        productSubCategoryId: productSubCategory.id,
        name: 'productA',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColor.id],
        sizeChartId: sizeChart.id,
        selectedSizesIds: [sizeS.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserA,
    );

    productB ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandC.id,
        productSubCategoryId: productSubCategory.id,
        name: 'productB',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColor.id],
        sizeChartId: sizeChart.id,
        selectedSizesIds: [sizeS.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserB,
    );

    productC ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandC.id,
        productSubCategoryId: productSubCategory.id,
        name: 'productC',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColor.id],
        sizeChartId: sizeChart.id,
        selectedSizesIds: [sizeS.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserB,
    );

    if (!productA.linesheet) {
      productA = await context.testingModule
        .get(ProductFactory)
        .assignProductToLinesheet(
          {
            productId: productA.id,
            linesheetId: publishLinesheetA.id,
          },
          brandUserA,
        );
    }

    if (!publishLinesheetA.isPublished) {
      publishLinesheetA = await context.testingModule
        .get(LinesheetFactory)
        .publishLinesheet(publishLinesheetA.id, brandUserA);
    }

    if (!productB.linesheet) {
      productB = await context.testingModule
        .get(ProductFactory)
        .assignProductToLinesheet(
          {
            productId: productB.id,
            linesheetId: publishLinesheetD.id,
          },
          brandUserB,
        );
    }

    if (!productC.linesheet) {
      productC = await context.testingModule
        .get(ProductFactory)
        .assignProductToLinesheet(
          {
            productId: productC.id,
            linesheetId: unPublishLinesheetE.id,
          },
          brandUserB,
        );
    }

    if (!publishLinesheetD.isPublished) {
      publishLinesheetD = await context.testingModule
        .get(LinesheetFactory)
        .publishLinesheet(publishLinesheetD.id, brandUserB);
    }
  });

  describe('Create', () => {
    let brand: BrandEntity;

    beforeEach(async () => {
      brand = await context.testingModule.get(BrandFactory).create(
        {
          accountId: account.id,
          name: 'Test Brand',
          description: 'Test Description',
        },
        context.systemManagerUser,
      );
    });

    it(`should returns created linesheet`, (done) => {
      const expected = {
        title: 'title',
        description: 'description',
        brand: {
          id: brand.id,
        },
      };

      const query = `mutation {createLinesheet(input: {
          brandId: "${brand.id}"
          title: "${expected.title}"
          description: "${expected.description}"
        }) {
          title
          description
          brand {
            id
          }
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.createLinesheet).toEqual(expected);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    it(`send non-existent brand id, should returns error`, (done) => {
      const query = `
        mutation {
          createLinesheet(input: {
            brandId: "dc2a2708-3dae-452c-b5aa-ff1039979127"
            title: "title"
            description: "description"
          }) {
            title
            description
          }
        }
      `;

      const expectFunction = (res) => {
        expect(res.body.data.createLinesheet).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });
  });

  describe('Get system linesheets', () => {
    it(`should returns all linesheets`, (done) => {
      const query = `{systemLinesheets(input: {}) {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.systemLinesheets).toEqual(
          expect.arrayContaining([
            { id: publishLinesheetA.id },
            { id: unPublishLinesheetB.id },
            { id: unPublishLinesheetC.id },
            { id: publishLinesheetD.id },
            { id: unPublishLinesheetE.id },
            { id: unPublishLinesheetE.id },
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

    it(`should returns linesheets by brandId`, (done) => {
      const query = `{systemLinesheets(input: { brandId: "${publishBrandA.id}" }) {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.systemLinesheets).toEqual(
          expect.arrayContaining([
            { id: publishLinesheetA.id },
            { id: unPublishLinesheetB.id },
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

    it(`should not returns linesheets, not authorized`, (done) => {
      const query = `{systemLinesheets(input: {}) {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

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

    it(`should return empty array of linesheets, by brandId without linesheets`, (done) => {
      const query = `{systemLinesheets(input: {
          brandId: "${unPublishBrandD.id}"
        }) {
          id
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
  });

  describe('Get my linesheets', () => {
    it(`should returns linesheets`, (done) => {
      const query = `{myLinesheets(input: {}) {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.myLinesheets).toEqual(
          expect.arrayContaining([
            { id: publishLinesheetA.id },
            { id: unPublishLinesheetB.id },
            { id: unPublishLinesheetC.id },
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

    it(`should returns linesheets, by brandId`, (done) => {
      const query = `{myLinesheets(input: { brandId: "${unPublishBrandB.id}" }) {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.myLinesheets).toEqual(
          expect.arrayContaining([{ id: unPublishLinesheetC.id }]),
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

    it(`should not returns linesheets, not authorized`, (done) => {
      const query = `{myLinesheets(input: {}) {
          id
        }}`;

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

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );
    });

    it(`should return empty array of linesheets, by non exist brandId`, (done) => {
      const nonExistBrandId = '3973088e-5f40-4aaf-82e6-2a9b487456e2';

      const query = `{myLinesheets(input: { brandId: "${nonExistBrandId}" }) {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.myLinesheets).toEqual([]);
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

  describe('Get linesheets', () => {
    it(`should returns linesheets`, (done) => {
      const query = `{linesheets(input: {}) {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.linesheets).toEqual(
          expect.arrayContaining([
            { id: publishLinesheetA.id },
            { id: publishLinesheetD.id },
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

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );
    });

    it(`should returns linesheets, by brandId`, (done) => {
      const query = `{linesheets(input: { brandId: "${publishBrandC.id}" }) {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.linesheets).toEqual(
          expect.arrayContaining([{ id: publishLinesheetD.id }]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );
    });

    it(`should return empty array of linesheets, by non exist brandId`, (done) => {
      const nonExistBrandId = '3973088e-5f40-4aaf-82e6-2a9b487456e2';

      const query = `{linesheets(input: { brandId: "${nonExistBrandId}" }) {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.linesheets).toEqual([]);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );
    });
  });

  describe('Get linesheet', () => {
    it(`should returns linesheet`, (done) => {
      const query = `{linesheet(id: "${publishLinesheetA.id}") {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.linesheet).toEqual({
          id: publishLinesheetA.id,
        });
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );

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

    it(`should non returns unpublish linesheet, not authorized`, (done) => {
      const query = `{linesheet(id: "${unPublishLinesheetC.id}") {
          id
        }}`;

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

    it(`should returns unpublish linesheet`, (done) => {
      const query = `{linesheet(id: "${unPublishLinesheetC.id}") {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.linesheet).toEqual({ id: unPublishLinesheetC.id });
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
        context.currentUserAccessToken,
      );
    });

    it(`should not returns linesheet by non exist linesheetId`, (done) => {
      const nonExistLinesheetId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{linesheet(id: "${nonExistLinesheetId}") {
          id
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.currentUserAccessToken,
      );
    });
  });

  describe('Edit', () => {
    let firstBrand: BrandEntity;
    let firstLinesheetOfFirstBrand: LinesheetEntity;

    beforeEach(async () => {
      firstBrand = await context.testingModule.get(BrandFactory).create(
        {
          accountId: account.id,
          name: 'First Brand',
          description: 'First Brand Description',
        },
        context.systemManagerUser,
      );

      firstLinesheetOfFirstBrand = await context.testingModule
        .get(LinesheetFactory)
        .create(
          firstBrand.id,
          'firstLinesheetOfFirstBrand',
          'firstLinesheetOfFirstBrand Description',
          context.systemManagerUser,
        );
    });

    it(`should returns updates linesheet`, (done) => {
      const newInfo = {
        title: 'new title',
        description: 'new description',
      };

      const query = `mutation {editLinesheet(input: {
          id: "${firstLinesheetOfFirstBrand.id}"
          title: "${newInfo.title}"
          description: "${newInfo.description}"
        }) {
          id
          title
          description
          brand {
            id
          }
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.editLinesheet).toEqual({
          id: firstLinesheetOfFirstBrand.id,
          title: newInfo.title,
          description: newInfo.description,
          brand: {
            id: firstBrand.id,
          },
        });
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    it(`send non-existent id, should returns error`, (done) => {
      const newInfo = {
        title: 'new title',
        description: 'new description',
      };

      const query = `mutation {editLinesheet(input: {
          id: "23e2e882-c927-429d-beb9-f6c9281fa4ee"
          title: "${newInfo.title}"
          description: "${newInfo.description}"
        }) {
          id
          title
          description
          brand {
            id
          }
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    it(`send invalid data, should returns error`, (done) => {
      const newInfo = {
        title: '',
      };

      const query = `mutation {editLinesheet(input: {
          id: "${firstLinesheetOfFirstBrand.id}"
          title: "${newInfo.title}"
        }) {
          id
          title
          description
          brand {
            id
          }
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });
  });

  describe('Change SequenceNo Of Linesheets', () => {
    let firstBrand: BrandEntity;
    let secondBrand: BrandEntity;
    let firstLinesheetOfFirstBrand: LinesheetEntity;
    let secondLinesheetOfFirstBrand: LinesheetEntity;
    let firstLinesheetOfSecondBrand: LinesheetEntity;

    beforeEach(async () => {
      firstBrand = await context.testingModule.get(BrandFactory).create(
        {
          accountId: account.id,
          name: 'First Brand',
          description: 'First Brand Description',
        },
        context.systemManagerUser,
      );

      secondBrand = await context.testingModule.get(BrandFactory).create(
        {
          accountId: account.id,
          name: 'secondBrand',
          description: 'secondBrand Description',
        },
        context.systemManagerUser,
      );

      firstLinesheetOfFirstBrand = await context.testingModule
        .get(LinesheetFactory)
        .create(
          firstBrand.id,
          'firstLinesheetOfFirstBrand',
          'firstLinesheetOfFirstBrand Description',
          context.systemManagerUser,
        );

      secondLinesheetOfFirstBrand = await context.testingModule
        .get(LinesheetFactory)
        .create(
          firstBrand.id,
          'secondLinesheetOfFirstBrand',
          'secondLinesheetOfFirstBrand Description',
          context.systemManagerUser,
        );

      firstLinesheetOfSecondBrand = await context.testingModule
        .get(LinesheetFactory)
        .create(
          secondBrand.id,
          'firstLinesheetOfSecondBrand',
          'firstLinesheetOfSecondBrand Description',
          context.systemManagerUser,
        );
    });

    it(`should returns linesheets`, (done) => {
      const expected = [
        {
          id: firstLinesheetOfFirstBrand.id,
          sequenceNo: secondLinesheetOfFirstBrand.sequenceNo,
        },
        {
          id: secondLinesheetOfFirstBrand.id,
          sequenceNo: firstLinesheetOfFirstBrand.sequenceNo,
        },
      ];

      const query = `mutation {changeSequenceNoOfLinesheets(input: {
          brandId: "${firstBrand.id}"
          sequenceNoOfLinesheets: [
          {
            id: "${expected[0].id}"
            sequenceNo: ${expected[0].sequenceNo}
          },
          {
            id: "${expected[1].id}"
            sequenceNo: ${expected[1].sequenceNo}
          }
          ]
        }) {
          id
          sequenceNo
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.changeSequenceNoOfLinesheets).toEqual(
          expect.arrayContaining([
            {
              id: expected[0].id,
              sequenceNo: expected[0].sequenceNo,
            },
            {
              id: expected[1].id,
              sequenceNo: expected[1].sequenceNo,
            },
          ]),
        );
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    it(`send linesheets from different brands, should returns error`, (done) => {
      const query = `mutation {changeSequenceNoOfLinesheets(input: {
          brandId: "${firstBrand.id}"
          sequenceNoOfLinesheets: [
          {
            id: "${firstLinesheetOfFirstBrand.id}"
            sequenceNo: ${firstLinesheetOfSecondBrand.sequenceNo}
          },
          {
            id: "${firstLinesheetOfSecondBrand.id}"
            sequenceNo: ${firstLinesheetOfFirstBrand.sequenceNo}
          }
          ]
        }) {
          id
          sequenceNo
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    it(`send invalid sequenceNo, should returns error`, (done) => {
      const query = `mutation {changeSequenceNoOfLinesheets(input: {
          brandId: "${firstBrand.id}"
          sequenceNoOfLinesheets: [
          {
            id: "${firstLinesheetOfFirstBrand.id}"
            sequenceNo: -1
          },
          {
            id: "${secondLinesheetOfFirstBrand.id}"
            sequenceNo: ${firstLinesheetOfFirstBrand.sequenceNo}
          }
          ]
        }) {
          id
          sequenceNo
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });
  });

  describe('Archive Linesheet', () => {
    let firstBrand: BrandEntity;
    let firstLinesheet: LinesheetEntity;
    let firstProduct: Product;
    let secondProduct: Product;
    let productColor: ProductColorEntity;

    let firstSizeChart: SizeChartEntity;
    let sizeS: SizeEntity;

    beforeEach(async () => {
      firstBrand = await context.testingModule.get(BrandFactory).create(
        {
          accountId: account.id,
          name: 'First Brand',
          description: 'First Brand Description',
        },
        context.systemManagerUser,
      );

      firstLinesheet = await context.testingModule
        .get(LinesheetFactory)
        .create(
          firstBrand.id,
          'firstLinesheet',
          'firstLinesheet Description',
          context.systemManagerUser,
        );

      productColor = await context.testingModule
        .get(ProductColorFactory)
        .findOrCreate('black');

      firstSizeChart = await context.testingModule
        .get(SizeChartFactory)
        .create('general', productSubCategory);

      sizeS = await context.testingModule
        .get(SizeFactory)
        .create('S', firstSizeChart);

      firstProduct = await context.testingModule.get(ProductFactory).create(
        {
          brandId: firstBrand.id,
          productSubCategoryId: productSubCategory.id,
          name: 'Product first',
          referenceCode: 'Code',
          wholesalePrice: new BigNumber(10.3),
          retailPrice: new BigNumber(9.32),
          currency: Currency.USD,
          colorIds: [productColor.id],
          sizeChartId: firstSizeChart.id,
          selectedSizesIds: [sizeS.id],
          previewImageId: 'previewImageId',
          imageIds: ['imageIds1', 'imageIds2'],
        },
        context.systemManagerUser,
      );

      await context.testingModule.get(ProductFactory).assignProductToLinesheet(
        {
          productId: firstProduct.id,
          linesheetId: firstLinesheet.id,
        },
        context.systemManagerUser,
      );

      secondProduct ||= await context.testingModule.get(ProductFactory).create(
        {
          brandId: firstBrand.id,
          productSubCategoryId: productSubCategory.id,
          name: 'Product second',
          referenceCode: 'Code',
          wholesalePrice: new BigNumber(10.3),
          retailPrice: new BigNumber(9.32),
          currency: Currency.USD,
          colorIds: [productColor.id],
          sizeChartId: firstSizeChart.id,
          selectedSizesIds: [sizeS.id],
          previewImageId: 'previewImageId',
          imageIds: ['imageIds1', 'imageIds2'],
        },
        context.systemManagerUser,
      );

      await context.testingModule.get(ProductFactory).assignProductToLinesheet(
        {
          productId: secondProduct.id,
          linesheetId: firstLinesheet.id,
        },
        context.systemManagerUser,
      );
    });

    it(`should returns linesheet with archivedAt`, (done) => {
      const query = `
        mutation {
          archiveLinesheet(id: "${firstLinesheet.id}") {
          id
          archivedAt
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.archiveLinesheet.archivedAt).not.toEqual(
          undefined,
        );
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    // ToDo: uncomment and fix
    // it(`send non-existent linesheetId, should returns error`, (done) => {
    //   const query = `
    //     mutation {
    //       archiveLinesheet(id: "0e7b5b4e-c01a-449f-8999-fa696a35ab20") {
    //       id
    //     }
    //   }`;
    //
    //   const endCallback = (err, res) => {
    //     if (err) {
    //       return done(err);
    //     }
    //
    //     expect(res.body.data).toEqual(null);
    //
    //     done();
    //   };
    //
    //   context.graphqlRequestTest(query, 200, endCallback);
    // });
  });

  describe('Publish Linesheet', () => {
    it(`should returns published linesheet`, (done) => {
      const query = `
        mutation {
          publishLinesheet(linesheetId: "${unPublishLinesheetE.id}") {
          id
          isPublished
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.publishLinesheet).toEqual({
          id: unPublishLinesheetE.id,
          isPublished: true,
        });
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it(`should not returns published linesheet, not authorized`, (done) => {
      const query = `
        mutation {
          publishLinesheet(linesheetId: "${unPublishLinesheetE.id}") {
          id
          isPublished
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

    it(`should not returns published linesheet, brand is not published`, (done) => {
      const query = `
        mutation {
          publishLinesheet(linesheetId: "${unPublishLinesheetC.id}") {
          id
          isPublished
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
        brandUserAAccessToken,
      );
    });

    it(`should not returns published linesheet, linesheet has not product`, (done) => {
      const query = `
        mutation {
          publishLinesheet(linesheetId: "${unPublishLinesheetB.id}") {
          id
          isPublished
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
        brandUserAAccessToken,
      );
    });

    it(`should not returns published linesheet, with non exist linesheetId`, (done) => {
      const nonExistLinesheetId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `
        mutation {
          publishLinesheet(linesheetId: "${nonExistLinesheetId}") {
          id
          isPublished
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
        brandUserAAccessToken,
      );
    });
  });

  describe('UnPublish Linesheet', () => {
    it(`should returns unPublished linesheet`, (done) => {
      const query = `
        mutation {
          unPublishLinesheet(linesheetId: "${publishLinesheetA.id}") {
          id
          isPublished
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.unPublishLinesheet).toEqual({
          id: publishLinesheetA.id,
          isPublished: false,
        });
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAAccessToken,
      );
    });

    it(`should not returns unPublished linesheet, not authorized`, (done) => {
      const query = `
        mutation {
          unPublishLinesheet(linesheetId: "${publishLinesheetA.id}") {
          id
          isPublished
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

    it(`should not returns unPublished linesheet, with non exist linesheetId`, (done) => {
      const nonExistLinesheetId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `
        mutation {
          unPublishLinesheet(linesheetId: "${nonExistLinesheetId}") {
          id
          isPublished
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
        brandUserAAccessToken,
      );
    });
  });
});
