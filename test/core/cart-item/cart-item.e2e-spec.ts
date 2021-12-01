import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { UpdateResult } from 'typeorm';

import { AccountEntity } from '../../../src/core/account/account.entity';
import { BrandEntity } from '../../../src/core/brand/brand.entity';
import { CartItemEntity } from '../../../src/core/cart-item/cart-item.entity';
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
import { CartItemFactory } from '../../factories/cart-item.factory';
import { LinesheetFactory } from '../../factories/linesheet.factory';
import { ProductCategoryFactory } from '../../factories/product-category.factory';
import { ProductColorFactory } from '../../factories/product-color.factory';
import { ProductSubCategortFactory } from '../../factories/product-sub-categort.factory';
import { ProductFactory } from '../../factories/product.factory';
import { SizeChartFactory } from '../../factories/size-chart.factory';
import { SizeFactory } from '../../factories/size.factory';
import { UserFactory } from '../../factories/user.factory';

describe('Cart Item', () => {
  const context = initEndToEndTest();

  let brandAccount: AccountEntity;
  let retailerAccountA: AccountEntity;
  let retailerAccountB: AccountEntity;
  let retailerAccountC: AccountEntity;

  let cartItemA: CartItemEntity;
  let quantityCartItemA: number;

  let cartItemB: CartItemEntity;
  let quantityCartItemB: number;

  let publishBrandA: BrandEntity;

  let brandUserA: UserEntity;
  let retailerUserA: UserEntity;
  let retailerUserB: UserEntity;
  let retailerUserC: UserEntity;

  let brandUserAAccessToken: string;
  let retailerUserAAccessToken: string;
  let retailerUserBAccessToken: string;
  let retailerUserCAccessToken: string;

  let publishLinesheetA: LinesheetEntity;
  let unPublishLinesheetB: LinesheetEntity;

  let productA: Product;
  let productB: Product;
  let productC: Product;
  let archivedProduct: Product;
  let updateResultArchivedProduct: UpdateResult;

  let productColorA: ProductColorEntity;
  let productColorB: ProductColorEntity;

  let productCategory: ProductCategoryEntity;
  let subCategory: ProductSubCategoryEntity;

  let sizeChartA: SizeChartEntity;
  let sizeS: SizeEntity;
  let sizeM: SizeEntity;

  let sizeChartB: SizeChartEntity;
  let size36: SizeEntity;

  beforeEach(async () => {
    brandAccount ||= await context.testingModule
      .get(AccountFactory)
      .create(
        'brandAccount',
        AccountType.BRAND_ACCOUNT,
        context.systemManagerUser,
      );

    retailerAccountA ||= await context.testingModule
      .get(AccountFactory)
      .create(
        'retailerAccountA',
        AccountType.RETAILER,
        context.systemManagerUser,
      );

    retailerAccountB ||= await context.testingModule
      .get(AccountFactory)
      .create(
        'retailerAccountB',
        AccountType.RETAILER,
        context.systemManagerUser,
      );

    retailerAccountC ||= await context.testingModule
      .get(AccountFactory)
      .create(
        'retailerAccountC',
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
      brandAccount,
    );

    brandUserAAccessToken ||= await context.testingModule
      .get(AuthFactory)
      .getAccessToken(brandUserA.id);

    retailerUserA ||= await context.testingModule.get(UserFactory).findOrCreate(
      {
        email: 'retailerUserA@gmail.com',
        lastName: 'retailerUserA',
        firstName: 'retailerUserA',
        emailConfirmedAt: DateTime.local(),
        abilityType: AbilityType.ACCOUNT_MANAGER,
      },
      retailerAccountA,
    );

    retailerUserAAccessToken ||= await context.testingModule
      .get(AuthFactory)
      .getAccessToken(retailerUserA.id);

    retailerUserB ||= await context.testingModule.get(UserFactory).findOrCreate(
      {
        email: 'retailerUserB@gmail.com',
        lastName: 'retailerUserB',
        firstName: 'retailerUserB',
        emailConfirmedAt: DateTime.local(),
        abilityType: AbilityType.ACCOUNT_MANAGER,
      },
      retailerAccountB,
    );

    retailerUserBAccessToken ||= await context.testingModule
      .get(AuthFactory)
      .getAccessToken(retailerUserB.id);

    retailerUserC ||= await context.testingModule.get(UserFactory).findOrCreate(
      {
        email: 'retailerUserC@gmail.com',
        lastName: 'retailerUserC',
        firstName: 'retailerUserC',
        emailConfirmedAt: DateTime.local(),
        abilityType: AbilityType.ACCOUNT_MANAGER,
      },
      retailerAccountC,
    );

    retailerUserCAccessToken ||= await context.testingModule
      .get(AuthFactory)
      .getAccessToken(retailerUserC.id);

    publishBrandA ||= await context.testingModule.get(BrandFactory).create(
      {
        accountId: brandAccount.id,
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

    productColorA ||= await context.testingModule
      .get(ProductColorFactory)
      .findOrCreate('productColorA');

    productColorB ||= await context.testingModule
      .get(ProductColorFactory)
      .findOrCreate('productColorB');

    productCategory ||= await context.testingModule
      .get(ProductCategoryFactory)
      .create('productCategory');

    subCategory ||= await context.testingModule
      .get(ProductSubCategortFactory)
      .create('subCategory', productCategory);

    sizeChartA ||= await context.testingModule
      .get(SizeChartFactory)
      .create('sizeChartA', subCategory);

    sizeS ||= await context.testingModule
      .get(SizeFactory)
      .create('sizeS', sizeChartA);

    sizeM ||= await context.testingModule
      .get(SizeFactory)
      .create('sizeM', sizeChartA);

    sizeChartB ||= await context.testingModule
      .get(SizeChartFactory)
      .create('sizeChartB', subCategory);

    size36 ||= await context.testingModule
      .get(SizeFactory)
      .create('size36', sizeChartB);

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

    productA ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandA.id,
        productSubCategoryId: subCategory.id,
        name: 'productA',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColorA.id],
        sizeChartId: sizeChartA.id,
        selectedSizesIds: [sizeS.id],
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
        productSubCategoryId: subCategory.id,
        name: 'productBInput',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColorA.id, productColorB.id],
        sizeChartId: sizeChartB.id,
        selectedSizesIds: [size36.id],
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
        productSubCategoryId: subCategory.id,
        name: 'productCInput',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColorA.id],
        sizeChartId: sizeChartA.id,
        selectedSizesIds: [sizeS.id],
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

    archivedProduct ||= await context.testingModule.get(ProductFactory).create(
      {
        brandId: publishBrandA.id,
        productSubCategoryId: subCategory.id,
        name: 'archivedProduct',
        referenceCode: 'Code',
        wholesalePrice: new BigNumber(10.3),
        retailPrice: new BigNumber(9.32),
        currency: Currency.USD,
        colorIds: [productColorA.id],
        sizeChartId: sizeChartA.id,
        selectedSizesIds: [sizeS.id],
        previewImageId: 'previewImageId',
        imageIds: ['imageIds1', 'imageIds2'],
      },
      brandUserA,
    );

    if (!archivedProduct.linesheet) {
      archivedProduct = await context.testingModule
        .get(ProductFactory)
        .assignProductToLinesheet(
          {
            productId: archivedProduct.id,
            linesheetId: publishLinesheetA.id,
          },
          brandUserA,
        );
    }

    quantityCartItemB = 5;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cartItemB ||= await context.testingModule.get(CartItemFactory).create(
      {
        productId: archivedProduct.id,
        productColorId: productColorA.id,
        sizeIdsWithQuantity: [
          {
            sizeId: sizeS.id,
            quantity: quantityCartItemB,
          },
        ],
      },
      retailerUserC,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateResultArchivedProduct ||= await context.testingModule
      .get(ProductFactory)
      .archive(archivedProduct.id, context.systemManagerUser);

    quantityCartItemA = 5;

    cartItemA ||= await context.testingModule.get(CartItemFactory).create(
      {
        productId: productB.id,
        productColorId: productColorA.id,
        sizeIdsWithQuantity: [
          {
            sizeId: size36.id,
            quantity: quantityCartItemA,
          },
        ],
      },
      retailerUserB,
    );
  });

  describe('Get my CartItems', () => {
    it('should returns my cartItems', (done) => {
      const query = `{ myCartItems {
        id
        product {
          name
        }
        productColor {
          name
        }
        quantitiesSizes {
          quantity
          size {
            name
          }
        }
      } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myCartItems).toEqual(
          expect.arrayContaining([
            {
              id: cartItemA.id,
              product: {
                name: productB.name,
              },
              productColor: {
                name: productColorA.name,
              },
              quantitiesSizes: [
                {
                  size: {
                    name: size36.name,
                  },
                  quantity: quantityCartItemA,
                },
              ],
            },
          ]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserBAccessToken,
      );
    });

    it('should returns my cartItems with not available', (done) => {
      const query = `{ myCartItems {
        isAvailable
        product {
          name
        }
      } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myCartItems).toEqual(
          expect.arrayContaining([
            {
              isAvailable: false,
              product: {
                name: archivedProduct.name,
              },
            },
          ]),
        );
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        retailerUserCAccessToken,
      );
    });

    it('should not returns my cartItems, not authorized (systemUser)', (done) => {
      const query = `{ myCartItems {
        id
      } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myCartItems).toEqual(null);
      };

      context.graphqlRequestTest(
        query,
        200,
        expectFunction,
        done,
        context.systemUserAccessToken,
      );
    });

    it('should not returns my cartItems, not authorized (brandUser)', (done) => {
      const query = `{ myCartItems {
        id
      } }`;

      const expectFunction = (res) => {
        expect(res.body.data.myCartItems).toEqual(null);
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

  describe('Create', () => {
    it('should create cartItem', (done) => {
      const quantity = 6;

      const mutation = `
      mutation {
        createCartItem(input: {
          productId: "${productA.id}"
          productColorId: "${productColorA.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${sizeS.id}"
            quantity: ${quantity}
          }]
        }) {
          product {
            id
            name
          }
          productColor {
            name
          }
          quantitiesSizes {
            size {
              name
            }
            quantity
          }
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.createCartItem).toEqual({
          product: {
            id: productA.id,
            name: productA.name,
          },
          productColor: {
            name: productColorA.name,
          },
          quantitiesSizes: [
            {
              size: {
                name: sizeS.name,
              },
              quantity,
            },
          ],
        });
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        retailerUserAAccessToken,
      );
    });

    it('should not create cartItem, with no exist productId', (done) => {
      const quantity = 6;
      const noExistId = 'e5eee7b3-db4d-4488-b22d-6d88ae1d1c8a';

      const mutation = `
      mutation {
        createCartItem(input: {
          productId: "${noExistId}"
          productColorId: "${productColorA.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${sizeS.id}"
            quantity: ${quantity}
          }]
        }) {
          id
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
        retailerUserAAccessToken,
      );
    });

    it('should not create cartItem, with not active product (unPublishLinesheet)', (done) => {
      const quantity = 6;

      const mutation = `
      mutation {
        createCartItem(input: {
          productId: "${productC.id}"
          productColorId: "${productColorA.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${sizeS.id}"
            quantity: ${quantity}
          }]
        }) {
          id
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
        retailerUserAAccessToken,
      );
    });

    it('should not create cartItem, with productColor not from productColors', (done) => {
      const quantity = 6;

      const mutation = `
      mutation {
        createCartItem(input: {
          productId: "${productA.id}"
          productColorId: "${productColorB.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${sizeS.id}"
            quantity: ${quantity}
          }]
        }) {
          id
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
        retailerUserAAccessToken,
      );
    });

    it('should not create cartItem, with quantity less 0', (done) => {
      const quantity = -3;

      const mutation = `
      mutation {
        createCartItem(input: {
          productId: "${productA.id}"
          productColorId: "${productColorB.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${sizeS.id}"
            quantity: ${quantity}
          }]
        }) {
          id
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
        retailerUserAAccessToken,
      );
    });

    it('should not create cartItem, with size ot from selectedProductSizes', (done) => {
      const quantity = 6;

      const mutation = `
      mutation {
        createCartItem(input: {
          productId: "${productA.id}"
          productColorId: "${productColorB.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${sizeM.id}"
            quantity: ${quantity}
          }]
        }) {
          id
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
        retailerUserAAccessToken,
      );
    });

    it('should not create cartItem, not authorized (systemUser)', (done) => {
      const quantity = 6;

      const mutation = `
      mutation {
        createCartItem(input: {
          productId: "${productA.id}"
          productColorId: "${productColorA.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${sizeS.id}"
            quantity: ${quantity}
          }]
        }) {
          id
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
        context.systemUserAccessToken,
      );
    });

    it('should not create cartItem, not authorized (brandUser)', (done) => {
      const quantity = 6;

      const mutation = `
      mutation {
        createCartItem(input: {
          productId: "${productA.id}"
          productColorId: "${productColorA.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${sizeS.id}"
            quantity: ${quantity}
          }]
        }) {
          id
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
        brandUserAAccessToken,
      );
    });
  });

  describe('Edit', () => {
    it('should edit cartItem', (done) => {
      const newQuantity = 8;

      const mutation = `
      mutation {
        editCartItem(input: {
          cartItemId: "${cartItemA.id}"
          productColorId: "${productColorB.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${size36.id}"
            quantity: ${newQuantity}
          }]
        }) {
          product {
            id
            name
          }
          productColor {
            name
          }
          quantitiesSizes {
            size {
              name
            }
            quantity
          }
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.editCartItem).toEqual({
          product: {
            id: productB.id,
            name: productB.name,
          },
          productColor: {
            name: productColorB.name,
          },
          quantitiesSizes: [
            {
              size: {
                name: size36.name,
              },
              quantity: newQuantity,
            },
          ],
        });
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        retailerUserBAccessToken,
      );
    });

    it('should not edit cartItem, with no exist cartItemId', (done) => {
      const noExistId = 'e5eee7b3-db4d-4488-b22d-6d88ae1d1c8a';

      const newQuantity = 8;

      const mutation = `
      mutation {
        editCartItem(input: {
          cartItemId: "${noExistId}"
          productColorId: "${productColorB.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${size36.id}"
            quantity: ${newQuantity}
          }]
        }) {
          id
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
        retailerUserBAccessToken,
      );
    });

    it('should not edit cartItem, with no exist productColor', (done) => {
      const newQuantity = 8;
      const noExistId = 'e5eee7b3-db4d-4488-b22d-6d88ae1d1c8a';

      const mutation = `
      mutation {
        editCartItem(input: {
          cartItemId: "${cartItemA.id}"
          productColorId: "${noExistId}"
          sizeIdsWithQuantity: [{
            sizeId: "${size36.id}"
            quantity: ${newQuantity}
          }]
        }) {
          id
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
        retailerUserBAccessToken,
      );
    });

    it('should not edit cartItem, with quantity less 0', (done) => {
      const newQuantity = -3;

      const mutation = `
      mutation {
        editCartItem(input: {
          cartItemId: "${cartItemA.id}"
          productColorId: "${productColorB.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${size36.id}"
            quantity: ${newQuantity}
          }]
        }) {
          id
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
        retailerUserAAccessToken,
      );
    });

    it('should not edit cartItem, with size ot from selectedProductSizes', (done) => {
      const newQuantity = 6;

      const mutation = `
      mutation {
        editCartItem(input: {
          cartItemId: "${cartItemA.id}"
          productColorId: "${productColorB.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${sizeS.id}"
            quantity: ${newQuantity}
          }]
        }) {
          id
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
        retailerUserAAccessToken,
      );
    });

    it('should not edit cartItem, not authorized (systemUser)', (done) => {
      const newQuantity = 6;

      const mutation = `
      mutation {
        editCartItem(input: {
          cartItemId: "${cartItemA.id}"
          productColorId: "${productColorB.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${size36.id}"
            quantity: ${newQuantity}
          }]
        }) {
          id
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
        context.systemUserAccessToken,
      );
    });

    it('should not edit cartItem, not authorized (retailer user from other account)', (done) => {
      const newQuantity = 6;

      const mutation = `
      mutation {
        editCartItem(input: {
          cartItemId: "${cartItemA.id}"
          productColorId: "${productColorB.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${size36.id}"
            quantity: ${newQuantity}
          }]
        }) {
          id
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
        retailerUserAAccessToken,
      );
    });

    it('should not edit cartItem, not authorized (brandUser)', (done) => {
      const newQuantity = 6;

      const mutation = `
      mutation {
        editCartItem(input: {
          cartItemId: "${cartItemA.id}"
          productColorId: "${productColorB.id}"
          sizeIdsWithQuantity: [{
            sizeId: "${size36.id}"
            quantity: ${newQuantity}
          }]
        }) {
          id
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
        brandUserAAccessToken,
      );
    });
  });

  describe('Remove', () => {
    it('should not remove cartItem, with no exist cartItemId', (done) => {
      const noExistId = 'e5eee7b3-db4d-4488-b22d-6d88ae1d1c8a';

      const mutation = `
      mutation {
        removeCartItem(cartItemId: "${noExistId}") {
          status
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
        retailerUserBAccessToken,
      );
    });

    it('should not remove cartItem, not authorized (systemUser)', (done) => {
      const mutation = `
      mutation {
        removeCartItem(cartItemId: "${cartItemA.id}") {
          status
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
        context.systemUserAccessToken,
      );
    });

    it('should not remove cartItem, not authorized (retailer user from other account)', (done) => {
      const mutation = `
      mutation {
        removeCartItem(cartItemId: "${cartItemA.id}") {
          status
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
        retailerUserAAccessToken,
      );
    });

    it('should not remove cartItem, not authorized (brandUser)', (done) => {
      const mutation = `
      mutation {
        removeCartItem(cartItemId: "${cartItemA.id}") {
          status
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
        brandUserAAccessToken,
      );
    });

    it('should edit cartItem', (done) => {
      const mutation = `
      mutation {
        removeCartItem(cartItemId: "${cartItemA.id}") {
          status
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.removeCartItem).toEqual({
          status: CustomResponseStatus.OK,
        });
      };

      context.graphqlRequestTest(
        mutation,
        200,
        expectFunction,
        done,
        retailerUserBAccessToken,
      );
    });
  });
});
