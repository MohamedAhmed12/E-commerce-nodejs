import { ProductCategoryEntity } from '../../../src/core/product-category/product-category.entity';
import { ProductSubCategoryEntity } from '../../../src/core/product-sub-category/product-sub-category.entity';
import { initEndToEndTest } from '../../common/e2e-test';
import { ProductCategoryFactory } from '../../factories/product-category.factory';
import { ProductSubCategortFactory } from '../../factories/product-sub-categort.factory';

describe('ProductSubCategory', () => {
  const context = initEndToEndTest();

  let productCategoryA: ProductCategoryEntity;
  let productCategoryB: ProductCategoryEntity;
  let productSubCategoryA: ProductSubCategoryEntity;
  let productSubCategoryB: ProductSubCategoryEntity;

  beforeEach(async () => {
    productCategoryA = await context.testingModule
      .get(ProductCategoryFactory)
      .create('productCategoryA');

    productCategoryB = await context.testingModule
      .get(ProductCategoryFactory)
      .create('productCategoryB');

    productSubCategoryA = await context.testingModule
      .get(ProductSubCategortFactory)
      .create('productSubCategoryA', productCategoryA);

    productSubCategoryB = await context.testingModule
      .get(ProductSubCategortFactory)
      .create('productSubCategoryB', productCategoryB);
  });

  describe('Get ProductSubCategories', () => {
    it('should returns productSubCategories', (done) => {
      const query = `{
        productSubCategories {
          name
          productCategory {
            name
          }
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.productSubCategories).toEqual(
          expect.arrayContaining([
            {
              name: productSubCategoryA.name,
              productCategory: {
                name: productCategoryA.name,
              },
            },
            {
              name: productSubCategoryB.name,
              productCategory: {
                name: productCategoryB.name,
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
        context.systemUserAccessToken,
      );
    });
  });
});
