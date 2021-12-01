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
  CustomResponseStatus,
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
import { S3Factory } from '../../factories/s3.factory';
import { SizeChartFactory } from '../../factories/size-chart.factory';
import { SizeFactory } from '../../factories/size.factory';
import { UserFactory } from '../../factories/user.factory';

describe('Product', () => {
  const context = initEndToEndTest();

  let account: AccountEntity;
  let brand: BrandEntity;

  let product: Product;
  let productColor: ProductColorEntity;

  let productCategory: ProductCategoryEntity;
  let firstSubCategory: ProductSubCategoryEntity;
  let secondSubCategory: ProductSubCategoryEntity;

  let firstSizeChart: SizeChartEntity;
  let sizeS: SizeEntity;

  let secondSizeChart: SizeChartEntity;
  let size36: SizeEntity;
  //

  let productCategoryA: ProductCategoryEntity;
  let productCategoryB: ProductCategoryEntity;
  let productSubCategoryA: ProductSubCategoryEntity;
  let productSubCategoryB: ProductSubCategoryEntity;
  let productSubCategoryC: ProductSubCategoryEntity;

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
  let productD: Product;
  let productE: Product;
  let productF: Product;
  let productG: Product;
  let productH: Product;
  let productI: Product;
  let productJ: Product;

  let sizeChartA: SizeChartEntity;
  let sizeChartB: SizeChartEntity;
  let sizeChartC: SizeChartEntity;
  let sizeL: SizeEntity;
  let sizeXL: SizeEntity;
  let sizeXXL: SizeEntity;

  beforeEach(async () => {
    account = await context.testingModule
      .get(AccountFactory)
      .create('Test Account', AccountType.SHOWROOM, context.systemManagerUser);

    brand = await context.testingModule.get(BrandFactory).create(
      {
        accountId: account.id,
        name: 'Test Brand',
        description: 'Test Description',
      },
      context.systemManagerUser,
    );

    productColor = await context.testingModule
      .get(ProductColorFactory)
      .findOrCreate('black');

    productCategory = await context.testingModule
      .get(ProductCategoryFactory)
      .create('ready_to_wear');

    firstSubCategory = await context.testingModule
      .get(ProductSubCategortFactory)
      .create('dresses', productCategory);

    firstSizeChart = await context.testingModule
      .get(SizeChartFactory)
      .create('general', firstSubCategory);

    sizeS = await context.testingModule
      .get(SizeFactory)
      .create('S', firstSizeChart);

    secondSubCategory = await context.testingModule
      .get(ProductSubCategortFactory)
      .create('skirt', productCategory);

    secondSizeChart = await context.testingModule
      .get(SizeChartFactory)
      .create('french', secondSubCategory);

    size36 = await context.testingModule
      .get(SizeFactory)
      .create('36', secondSizeChart);

    product = await context.testingModule.get(ProductFactory).create(
      {
        brandId: brand.id,
        productSubCategoryId: firstSubCategory.id,
        name: 'Product',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        description: 'Desc',
        material: 'cotton',
        minQuantity: 5,
        tags: ['1', '2', '3', '4', '5'],
        colorIds: [productColor.id],
        sizeChartId: firstSizeChart.id,
        selectedSizesIds: [sizeS.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      context.systemManagerUser,
    );

    //
    productCategoryA ||= await context.testingModule
      .get(ProductCategoryFactory)
      .create('productCategoryA');

    productSubCategoryA ||= await context.testingModule
      .get(ProductSubCategortFactory)
      .create('productSubCategoryA', productCategoryA);

    productSubCategoryB ||= await context.testingModule
      .get(ProductSubCategortFactory)
      .create('productSubCategoryB', productCategoryA);

    productCategoryB ||= await context.testingModule
      .get(ProductCategoryFactory)
      .create('productCategoryB');

    productSubCategoryC ||= await context.testingModule
      .get(ProductSubCategortFactory)
      .create('productSubCategoryC', productCategoryB);

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

    sizeChartA ||= await context.testingModule
      .get(SizeChartFactory)
      .create('sizeChartA', productSubCategoryA);

    sizeL ||= await context.testingModule
      .get(SizeFactory)
      .create('L', sizeChartA);

    sizeChartB ||= await context.testingModule
      .get(SizeChartFactory)
      .create('sizeChartB', productSubCategoryB);

    sizeXL ||= await context.testingModule
      .get(SizeFactory)
      .create('XL', sizeChartB);

    sizeChartC ||= await context.testingModule
      .get(SizeChartFactory)
      .create('sizeChartC', productSubCategoryC);

    sizeXXL ||= await context.testingModule
      .get(SizeFactory)
      .create('XXL', sizeChartC);

    productA ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandA.id,
        productSubCategoryId: productSubCategoryA.id,
        name: 'productA',
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
      brandUserA,
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

    productB ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandA.id,
        productSubCategoryId: productSubCategoryA.id,
        name: 'productBInput',
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
      brandUserA,
    );

    if (!productB.linesheet) {
      productB = await context.testingModule
        .get(ProductFactory)
        .assignProductToLinesheet(
          {
            productId: productB.id,
            linesheetId: publishLinesheetA.id,
          },
          brandUserA,
        );
    }

    productC ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandA.id,
        productSubCategoryId: productSubCategoryA.id,
        name: 'productCInput',
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
      brandUserA,
    );

    if (!productC.linesheet) {
      productC = await context.testingModule
        .get(ProductFactory)
        .assignProductToLinesheet(
          {
            productId: productC.id,
            linesheetId: unPublishLinesheetB.id,
          },
          brandUserA,
        );
    }

    productD ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandA.id,
        productSubCategoryId: productSubCategoryB.id,
        name: 'productDInput',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColor.id],
        sizeChartId: sizeChartB.id,
        selectedSizesIds: [sizeXL.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserA,
    );

    productE ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: unPublishBrandB.id,
        productSubCategoryId: productSubCategoryB.id,
        name: 'productEInput',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColor.id],
        sizeChartId: sizeChartB.id,
        selectedSizesIds: [sizeXL.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserA,
    );

    if (!productE.linesheet) {
      productE = await context.testingModule
        .get(ProductFactory)
        .assignProductToLinesheet(
          {
            productId: productE.id,
            linesheetId: unPublishLinesheetC.id,
          },
          brandUserA,
        );
    }

    productF ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: unPublishBrandB.id,
        productSubCategoryId: productSubCategoryB.id,
        name: 'productFInput',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColor.id],
        sizeChartId: sizeChartB.id,
        selectedSizesIds: [sizeXL.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserA,
    );

    productG ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandC.id,
        productSubCategoryId: productSubCategoryC.id,
        name: 'productGInput',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColor.id],
        sizeChartId: sizeChartC.id,
        selectedSizesIds: [sizeXXL.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserB,
    );

    if (!productG.linesheet) {
      productG = await context.testingModule
        .get(ProductFactory)
        .assignProductToLinesheet(
          {
            productId: productG.id,
            linesheetId: publishLinesheetD.id,
          },
          brandUserB,
        );
    }

    if (!publishLinesheetD.isPublished) {
      publishLinesheetD = await context.testingModule
        .get(LinesheetFactory)
        .publishLinesheet(publishLinesheetD.id, brandUserB);
    }

    productH ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandC.id,
        productSubCategoryId: productSubCategoryC.id,
        name: 'productHInput',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColor.id],
        sizeChartId: sizeChartC.id,
        selectedSizesIds: [sizeXXL.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserB,
    );

    if (!productH.linesheet) {
      productH = await context.testingModule
        .get(ProductFactory)
        .assignProductToLinesheet(
          {
            productId: productH.id,
            linesheetId: unPublishLinesheetE.id,
          },
          brandUserB,
        );
    }

    productI ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandC.id,
        productSubCategoryId: productSubCategoryC.id,
        name: 'productIInput',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColor.id],
        sizeChartId: sizeChartC.id,
        selectedSizesIds: [sizeXXL.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserB,
    );

    productJ ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: unPublishBrandD.id,
        productSubCategoryId: productSubCategoryC.id,
        name: 'productJInput',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColor.id],
        sizeChartId: sizeChartC.id,
        selectedSizesIds: [sizeXXL.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserB,
    );
  });

  describe('Get system Products', () => {
    it('should returns all products', (done) => {
      const query = `{ systemProducts(input: {}) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemProducts).toEqual(
          expect.arrayContaining([
            { name: productA.name },
            { name: productB.name },
            { name: productC.name },
            { name: productD.name },
            { name: productE.name },
            { name: productF.name },
            { name: productG.name },
            { name: productH.name },
            { name: productI.name },
            { name: productJ.name },
            { name: product.name },
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

    it('should not returns all products, not authorized', (done) => {
      const query = `{ systemProducts(input: {}) { name } }`;

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

    it('should returns products by brandId', (done) => {
      const query = `{ systemProducts(input: { brandId: "${unPublishBrandB.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemProducts).toEqual(
          expect.arrayContaining([
            { name: productE.name },
            { name: productF.name },
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

    it('should returns empty array of products by non exist brandId', (done) => {
      const nonExistBrandId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ systemProducts(input: { brandId: "${nonExistBrandId}" }) { name } }`;

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

    it('should returns products by linesheetId', (done) => {
      const query = `{ systemProducts(input: { linesheetId: "${publishLinesheetA.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemProducts).toEqual(
          expect.arrayContaining([
            { name: productA.name },
            { name: productB.name },
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

    it('should returns empty array of products by non exist linesheetId', (done) => {
      const nonExistId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ systemProducts(input: { linesheetId: "${nonExistId}" }) { name } }`;

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

    it('should returns products by productCategoryId', (done) => {
      const query = `{ systemProducts(input: { productCategoryId: "${productCategoryB.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemProducts).toEqual(
          expect.arrayContaining([
            { name: productG.name },
            { name: productH.name },
            { name: productI.name },
            { name: productJ.name },
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

    it('should returns empty array of products by non exist productCategoryId', (done) => {
      const nonExistId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ systemProducts(input: { productCategoryId: "${nonExistId}" }) { name } }`;

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

    it('should returns products by productSubCategoryId', (done) => {
      const query = `{ systemProducts(input: { productSubCategoryId: "${productSubCategoryB.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemProducts).toEqual(
          expect.arrayContaining([
            { name: productD.name },
            { name: productE.name },
            { name: productF.name },
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

    it('should returns empty array of products by non exist productSubCategoryId', (done) => {
      const nonExistId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ systemProducts(input: { productSubCategoryId: "${nonExistId}" }) { name } }`;

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
  });

  describe('Get my Products', () => {
    it('should returns all my products', (done) => {
      const query = `{ myProducts(input: {}) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myProducts).toEqual(
          expect.arrayContaining([
            { name: productG.name },
            { name: productH.name },
            { name: productI.name },
            { name: productJ.name },
          ]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it('should not returns my products, not authorized', (done) => {
      const query = `{ myProducts(input: {}) { name } }`;

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

    it('should returns products by brandId', (done) => {
      const query = `{ myProducts(input: { brandId: "${unPublishBrandD.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myProducts).toEqual(
          expect.arrayContaining([{ name: productJ.name }]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it('should returns empty array of products by brandId of another account', (done) => {
      const query = `{ myProducts(input: { brandId: "${unPublishBrandB.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myProducts).toEqual([]);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it('should returns products by linesheetId', (done) => {
      const query = `{ myProducts(input: { linesheetId: "${unPublishLinesheetB.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myProducts).toEqual(
          expect.arrayContaining([{ name: productC.name }]),
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

    it('should returns empty array of products by linesheetId of another account', (done) => {
      const query = `{ myProducts(input: { linesheetId: "${publishLinesheetD.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myProducts).toEqual([]);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAAccessToken,
      );
    });

    it('should returns products by productCategoryId', (done) => {
      const query = `{ myProducts(input: { productCategoryId: "${productCategoryB.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myProducts).toEqual(
          expect.arrayContaining([
            { name: productG.name },
            { name: productH.name },
            { name: productI.name },
            { name: productJ.name },
          ]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it('should returns empty array of products by non exist productCategoryId', (done) => {
      const nonExistId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ myProducts(input: { productCategoryId: "${nonExistId}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myProducts).toEqual([]);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it('should returns products by productSubCategoryId', (done) => {
      const query = `{ myProducts(input: { productSubCategoryId: "${productSubCategoryC.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myProducts).toEqual(
          expect.arrayContaining([
            { name: productG.name },
            { name: productH.name },
            { name: productI.name },
            { name: productJ.name },
          ]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it('should returns empty array of products by non exist productSubCategoryId', (done) => {
      const nonExistId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ myProducts(input: { productSubCategoryId: "${nonExistId}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myProducts).toEqual([]);
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

  describe('Get Products', () => {
    it('should returns products assigned on published linesheets', (done) => {
      const query = `{ products(input: {}) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.products).toEqual(
          expect.arrayContaining([
            { name: productA.name },
            { name: productB.name },
            { name: productG.name },
          ]),
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

    it('should returns products by brandId', (done) => {
      const query = `{ products(input: { brandId: "${publishBrandA.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.products).toEqual(
          expect.arrayContaining([
            { name: productA.name },
            { name: productB.name },
          ]),
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

    it('should returns empty array of products by unpublished brandId', (done) => {
      const query = `{ products(input: { brandId: "${unPublishBrandB.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.products).toEqual([]);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );
    });

    it('should returns products by linesheetId', (done) => {
      const query = `{ products(input: { linesheetId: "${publishLinesheetD.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.products).toEqual(
          expect.arrayContaining([{ name: productG.name }]),
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

    it('should returns empty array of products by unpublished linesheetId', (done) => {
      const query = `{ products(input: { linesheetId: "${unPublishLinesheetB.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.products).toEqual([]);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAAccessToken,
      );
    });

    it('should returns products by productCategoryId', (done) => {
      const query = `{ products(input: { productCategoryId: "${productCategoryB.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.products).toEqual(
          expect.arrayContaining([{ name: productG.name }]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it('should returns empty array of products by non exist productCategoryId', (done) => {
      const nonExistId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ products(input: { productCategoryId: "${nonExistId}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.products).toEqual([]);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it('should returns products by productSubCategoryId', (done) => {
      const query = `{ products(input: { productSubCategoryId: "${productSubCategoryA.id}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.products).toEqual(
          expect.arrayContaining([
            { name: productA.name },
            { name: productB.name },
          ]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserBAccessToken,
      );
    });

    it('should returns empty array of products by non exist productSubCategoryId', (done) => {
      const nonExistId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ products(input: { productSubCategoryId: "${nonExistId}" }) { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.products).toEqual([]);
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

  describe('Get system Product', () => {
    it('should returns product', (done) => {
      const query = `{ systemProduct(productId: "${productA.id}") { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.systemProduct).toEqual({ name: productA.name });
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });

    it('should not returns product, not authorized (retailerUser)', (done) => {
      const query = `{ systemProduct(productId: "${productA.id}") { name } }`;

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

    it('should not returns product, not authorized (brandUser)', (done) => {
      const query = `{ systemProduct(productId: "${productA.id}") { name } }`;

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
    });

    it('should not returns product with non exist productId', (done) => {
      const nonExistId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ systemProduct(productId: "${nonExistId}") { name } }`;

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

  describe('Get my Product', () => {
    it('should returns product of unpublishBrand', (done) => {
      const query = `{ myProduct(productId: "${productE.id}") { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myProduct).toEqual({ name: productE.name });
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        brandUserAAccessToken,
      );
    });

    it('should not returns product, not authorized (retailerUser)', (done) => {
      const query = `{ myProduct(productId: "${productA.id}") { name } }`;

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

    it('should not returns product, not authorized (systemUser)', (done) => {
      const query = `{ myProduct(productId: "${productA.id}") { name } }`;

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

    it('should not returns product with non exist productId', (done) => {
      const nonExistId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ myProduct(productId: "${nonExistId}") { name } }`;

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

  describe('Get Product', () => {
    it('should returns product', (done) => {
      const query = `{ product(productId: "${productA.id}") { name } }`;

      const expectFunction = (res) => {
        expect(res.body.data.product).toEqual({ name: productA.name });
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );
    });

    it('should not returns product, not authorized (brandUser)', (done) => {
      const query = `{ product(productId: "${productA.id}") { name } }`;

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

    it('should not returns product with non exist productId', (done) => {
      const nonExistId = '96bee2d0-50ba-409d-9133-7915c09704a7';

      const query = `{ product(productId: "${nonExistId}") { name } }`;

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
  });

  describe('Create', () => {
    it('should create product', (done) => {
      const mutation = `
      mutation  {
        createProduct(input: {
          brandId: "${brand.id}",
          productSubCategoryId: "${firstSubCategory.id}",
          name: "${product.name}",
          referenceCode: "${product.referenceCode}",
          wholesalePrice: ${product.wholesalePrice},
          retailPrice: ${product.retailPrice},
          currency: ${product.currency},
          description: "${product.description}",
          material: "${product.material}",
          minQuantity: ${product.minQuantity},
          tags: ${JSON.stringify(product.tags)},
          colorIds: ["${productColor.id}"]
          sizeChartId: "${firstSizeChart.id}"
          selectedSizesIds: ["${sizeS.id}"]
          previewImageId: "${product.previewImageId}",
          imageIds: ${JSON.stringify(product.imageIds)},
        })
         {
           name,
           productSubCategory {
            id
            name
           }
           referenceCode,
           retailPrice,
           wholesalePrice,
           currency,
           description,
           material,
           minQuantity,
           tags
           productColors { id, name }
           sizeChart { id, name }
           selectedSizes { id, name }
           previewImageUrls { origin } 
        }
      }
    `;

      const expectFunction = (res) => {
        const originPreviewImageUrl = context.testingModule
          .get(S3Factory)
          .getFileUrlById(product.previewImageId);

        expect(res.body.data.createProduct).toEqual({
          name: product.name,
          productSubCategory: {
            id: firstSubCategory.id,
            name: firstSubCategory.name,
          },
          referenceCode: product.referenceCode,
          wholesalePrice: product.wholesalePrice.toNumber(),
          retailPrice: product.retailPrice.toNumber(),
          currency: product.currency,
          description: product.description,
          material: product.material,
          minQuantity: product.minQuantity,
          tags: product.tags,
          productColors: [{ id: productColor.id, name: productColor.name }],
          sizeChart: { id: firstSizeChart.id, name: firstSizeChart.name },
          selectedSizes: [
            {
              id: sizeS.id,
              name: sizeS.name,
            },
          ],
          previewImageUrls: {
            origin: originPreviewImageUrl,
          },
        });
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not create product with more than 5 tags', (done) => {
      const tags = ['1', '2', '3', '4', '5', '6'];

      const mutation = `
      mutation  {
        createProduct(input: {
          brandId: "${brand.id}",
          productSubCategoryId: "${firstSubCategory.id}",
          name: "${product.name}",
          referenceCode: "${product.referenceCode}",
          wholesalePrice: ${product.wholesalePrice},
          retailPrice: ${product.retailPrice},
          currency: ${product.currency}
          description: "${product.description}",
          material: "${product.material}",
          minQuantity: ${product.minQuantity},
          tags: ${JSON.stringify(tags)},
          colorIds: ["${productColor.id}"]
          sizeChartId: "${firstSizeChart.id}"
          selectedSizesIds: ["${sizeS.id}"]
          previewImageId: "${product.previewImageId}",
          imageIds: ${JSON.stringify(product.imageIds)}
        })
         {
           name
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not create product with undefined Product Colors', (done) => {
      const nonExistProductColorId = '3973088e-5f40-4aaf-82e6-2a9b487456e2';

      const mutation = `
      mutation  {
        createProduct(input: {
          brandId: "${brand.id}",
          productSubCategoryId: "${firstSubCategory.id}",
          name: "${product.name}",
          referenceCode: "${product.referenceCode}",
          wholesalePrice: ${product.wholesalePrice},
          retailPrice: ${product.retailPrice},
          currency: ${product.currency}
          description: "${product.description}",
          material: "${product.material}",
          minQuantity: ${product.minQuantity},
          tags: ${JSON.stringify(product.tags)},
          colorIds: ["${nonExistProductColorId}"]
          sizeChartId: "${firstSizeChart.id}"
          selectedSizesIds: ["${sizeS.id}"]
          previewImageId: "${product.previewImageId}"
          imageIds: ${JSON.stringify(product.imageIds)}
        })
         {
           name,
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not create product with non-existent productSubCategoryId', (done) => {
      const mutation = `
      mutation  {
        createProduct(input: {
          brandId: "${brand.id}",
          productSubCategoryId: "9c03504b-5ba9-4449-9e0a-ff32dc6b3d59",
          name: "${product.name}",
          referenceCode: "${product.referenceCode}",
          wholesalePrice: ${product.wholesalePrice},
          retailPrice: ${product.retailPrice},
          currency: ${product.currency}
          colorIds: ["${productColor.id}"],
          sizeChartId: "${firstSizeChart.id}"
          selectedSizesIds: ["${sizeS.id}"]
          previewImageId: "${product.previewImageId}"
          imageIds: ${JSON.stringify(product.imageIds)}
        })
         {
           name
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not create product with sizeChartId from other subCategory', (done) => {
      const mutation = `
      mutation  {
        createProduct(input: {
          brandId: "${brand.id}",
          productSubCategoryId: "${firstSubCategory.id}",
          name: "${product.name}",
          referenceCode: "${product.referenceCode}",
          wholesalePrice: ${product.wholesalePrice},
          retailPrice: ${product.retailPrice},
          currency: ${product.currency}
          colorIds: ["${productColor.id}"]
          sizeChartId: "${secondSizeChart.id}"
          selectedSizesIds: ["${sizeS.id}"]
          previewImageId: "${product.previewImageId}"
          imageIds: ${JSON.stringify(product.imageIds)}
        })
         {
           name
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not create product with sizeIds from different sizeCharts', (done) => {
      const mutation = `
      mutation  {
        createProduct(input: {
          brandId: "${brand.id}",
          productSubCategoryId: "${firstSubCategory.id}",
          name: "${product.name}",
          referenceCode: "${product.referenceCode}",
          wholesalePrice: ${product.wholesalePrice},
          retailPrice: ${product.retailPrice},
          currency: ${product.currency}
          colorIds: ["${productColor.id}"]
          sizeChartId: "${firstSizeChart.id}"
          selectedSizesIds: ["${sizeS.id}", "${size36}"]
          previewImageId: "${product.previewImageId}"
          imageIds: ${JSON.stringify(product.imageIds)}
        })
         {
           name
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });
  });

  describe('Update', () => {
    it('should update product', (done) => {
      const updatedProductName = 'Updated product name';

      const mutation = `
        mutation  {
          editProduct(input: {
            id: "${product.id}",
            name: "${updatedProductName}",
          }) {
            name
          }
        }
      `;

      const expectFunction = (res) => {
        expect(res.body.data.editProduct).toEqual({
          name: updatedProductName,
        });
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not update product with nonExistProductSubCategory', (done) => {
      const nonExistProductSubCategoryId =
        'e7492f12-6350-4297-b504-1634ff1b8d6e';

      const mutation = `
      mutation  {
        editProduct(input: {
          id: "${product.id}",
          productSubCategoryId: "${nonExistProductSubCategoryId}"
        })
         {
           id
           name,
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not update product with sizeChartId without selectedSizesIds', (done) => {
      const mutation = `
      mutation  {
        editProduct(input: {
          id: "${product.id}",
          sizeChartId: "${firstSizeChart.id}"
        })
         {
           id
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not update product with selectedSizesIds without sizeChartId', (done) => {
      const mutation = `
      mutation  {
        editProduct(input: {
          id: "${product.id}",
          selectedSizesIds: ["${sizeS.id}"]
        })
         {
           id
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });
  });

  describe('Archive product', () => {
    let newBrand: BrandEntity;
    let newProduct: Product;

    beforeEach(async () => {
      newBrand ||= await context.testingModule.get(BrandFactory).create(
        {
          accountId: account.id,
          name: 'firstBrand',
          description: 'firstBrand Description',
        },
        context.systemManagerUser,
      );

      newProduct ||= await context.testingModule.get(ProductFactory).create(
        {
          brandId: newBrand.id,
          productSubCategoryId: firstSubCategory.id,
          name: 'new Product',
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
    });

    it(`should returns archived products`, (done) => {
      const mutation = `
        mutation {
          archiveProduct(id: "${newProduct.id}") {
            status
          }
        }
      `;

      const expectFunction = (res) => {
        expect(res.body.data.archiveProduct).toEqual({
          status: CustomResponseStatus.OK,
        });
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it(`should returns empty array of products`, (done) => {
      const mutation = `{ systemProducts(input: {
      brandId: "${newBrand.id}"
      }) { name } }`;

      const expectFunction1 = (res) => {
        expect(res.body.data.systemProducts).toEqual([]);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction1, done);
    });

    it(`should not archive a non exist product`, (done) => {
      const nonExistProductId = 'e7492f12-6350-4297-b504-1634ff1b8d6e';

      const mutation = `
        mutation {
          archiveProduct(id: "${nonExistProductId}") {
            status
          }
        }
      `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });
  });

  describe('Assign product to linesheet', () => {
    let firstBrand: BrandEntity;
    let secondBrand: BrandEntity;

    let firstLinesheetOfFirstBrand: LinesheetEntity;
    let secondLinesheetOfFirstBrand: LinesheetEntity;
    let firstLinesheetOfSecondBrand: LinesheetEntity;

    let firstProductOfFirstBrand: Product;
    let secondProductOfFirstBrand: Product;

    beforeEach(async () => {
      firstBrand = await context.testingModule.get(BrandFactory).create(
        {
          accountId: account.id,
          name: 'firstBrand',
          description: 'firstBrand Description',
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
          'linesheet',
          'linesheet Description',
          context.systemManagerUser,
        );

      firstLinesheetOfSecondBrand = await context.testingModule
        .get(LinesheetFactory)
        .create(
          secondBrand.id,
          'linesheet',
          'linesheet Description',
          context.systemManagerUser,
        );

      secondLinesheetOfFirstBrand = await context.testingModule
        .get(LinesheetFactory)
        .create(
          firstBrand.id,
          'linesheet',
          'linesheet Description',
          context.systemManagerUser,
        );

      firstProductOfFirstBrand ||= await context.testingModule
        .get(ProductFactory)
        .create(
          {
            brandId: firstBrand.id,
            productSubCategoryId: firstSubCategory.id,
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

      secondProductOfFirstBrand = await context.testingModule
        .get(ProductFactory)
        .create(
          {
            brandId: firstBrand.id,
            productSubCategoryId: firstSubCategory.id,
            name: 'Product 2',
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
    });
    it('should assign product to linesheet', (done) => {
      const query = `
      mutation  {
        assignProductToLinesheet(input: {
          productId: "${firstProductOfFirstBrand.id}",
          linesheetId: "${firstLinesheetOfFirstBrand.id}"
        })
         {
           id,
           linesheet {
             id
           }
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data.assignProductToLinesheet).toEqual({
          id: firstProductOfFirstBrand.id,
          linesheet: {
            id: firstLinesheetOfFirstBrand.id,
          },
        });
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    it('send product with linesheet, should returns error', (done) => {
      const query = `
        mutation  {
          assignProductToLinesheet(input: {
            productId: "${firstProductOfFirstBrand.id}",
            linesheetId: "${secondLinesheetOfFirstBrand.id}"
          })
           {
             id,
             linesheet {
               id
             }
          }
        }
      `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });

    it('send linesheet with another brand, should returns error', (done) => {
      const query = `
        mutation  {
          assignProductToLinesheet(input: {
            productId: "${secondProductOfFirstBrand.id}",
            linesheetId: "${firstLinesheetOfSecondBrand.id}"
          })
           {
             id,
             linesheet {
               id
             }
          }
        }
      `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });
  });
});
