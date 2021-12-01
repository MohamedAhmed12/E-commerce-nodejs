import { ProductColorEntity } from '../../../src/core/product-color/product-color.entity';
import { initEndToEndTest } from '../../common/e2e-test';
import { ProductColorFactory } from '../../factories/product-color.factory';

describe('ProductColor', () => {
  const context = initEndToEndTest();

  let productColorA: ProductColorEntity;
  let productColorB: ProductColorEntity;

  beforeEach(async () => {
    productColorA = await context.testingModule
      .get(ProductColorFactory)
      .findOrCreate('productColorA');

    productColorB = await context.testingModule
      .get(ProductColorFactory)
      .findOrCreate('productColorB');
  });

  describe('Get ProductColor', () => {
    it('should returns productColor', (done) => {
      const query = `{
        productColors {
          name
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.productColors).toEqual(
          expect.arrayContaining([
            {
              name: productColorA.name,
            },
            {
              name: productColorB.name,
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
