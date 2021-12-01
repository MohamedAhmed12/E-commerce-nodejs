import { ProductCategoryEntity } from '../../../src/core/product-category/product-category.entity';
import { ProductSubCategoryEntity } from '../../../src/core/product-sub-category/product-sub-category.entity';
import { SizeChartEntity } from '../../../src/core/size-chart/size-chart.entity';
import { SizeEntity } from '../../../src/core/size/size.entity';
import { initEndToEndTest } from '../../common/e2e-test';
import { ProductCategoryFactory } from '../../factories/product-category.factory';
import { ProductSubCategortFactory } from '../../factories/product-sub-categort.factory';
import { SizeChartFactory } from '../../factories/size-chart.factory';
import { SizeFactory } from '../../factories/size.factory';

describe('SizeChart', () => {
  const context = initEndToEndTest();

  let category: ProductCategoryEntity;
  let subCategory: ProductSubCategoryEntity;

  let firstSizeChart: SizeChartEntity;
  let secondSizeChart: SizeChartEntity;

  let firstSizeChartName: string;
  let sizeM: SizeEntity;

  beforeEach(async () => {
    category = await context.testingModule
      .get(ProductCategoryFactory)
      .create('ready_to_wear');

    subCategory = await context.testingModule
      .get(ProductSubCategortFactory)
      .create('dresses', category);

    firstSizeChartName = 'general';

    firstSizeChart = await context.testingModule
      .get(SizeChartFactory)
      .create(firstSizeChartName, subCategory);

    secondSizeChart = await context.testingModule
      .get(SizeChartFactory)
      .create('US', subCategory);

    sizeM = await context.testingModule
      .get(SizeFactory)
      .create('M', secondSizeChart);
  });

  describe('Create SizeChart', () => {
    it('should create sizeChart with 1 size', (done) => {
      const sizeChartName = 'UK';
      const sizeName34 = '34';

      const mutation = `
      mutation {
        createSizeChart(input: {
          subCategoryId: "${subCategory.id}"
          sizeChartName: "${sizeChartName}"
          sizes: ["${sizeName34}"]
      }) {
          name
          sizes {
            name
          }
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data.createSizeChart).toEqual({
          name: sizeChartName,
          sizes: [{ name: sizeName34 }],
        });
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should create sizeChart with 2 sizes', (done) => {
      const sizeChartName = 'UK';
      const sizeName34 = '34';
      const sizeName36 = '36';

      const mutation = `
      mutation {
        createSizeChart(input: {
          subCategoryId: "${subCategory.id}"
          sizeChartName: "${sizeChartName}"
          sizes: ["${sizeName34}", "${sizeName36}"]
      }) {
          name
          sizes {
            name
          }
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data.createSizeChart.sizes).toEqual(
          expect.arrayContaining([{ name: sizeName34 }, { name: sizeName36 }]),
        );
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not create sizeChart with non-existent subCategoryId', (done) => {
      const sizeChartName = 'UK';
      const sizeName34 = '34';

      const nonExistentSubCategoryId = '070b402c-6664-4533-aadd-d210ca598fce';

      const mutation = `
      mutation {
        createSizeChart(input: {
          subCategoryId: "${nonExistentSubCategoryId}"
          sizeChartName: "${sizeChartName}"
          sizes: ["${sizeName34}"]
      }) {
          name
          sizes {
            name
          }
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not create sizeChart with no a unique name', (done) => {
      const sizeName34 = '34';

      const mutation = `
      mutation {
        createSizeChart(input: {
          subCategoryId: "${subCategory.id}"
          sizeChartName: "${firstSizeChartName}"
          sizes: ["${sizeName34}"]
      }) {
          name
          sizes {
            name
          }
        }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });
  });

  describe('Add size to SizeChart', () => {
    it('should add size to sizeChart', (done) => {
      const sizeName40 = '40';

      const mutation = `
        mutation {
          addSizeToSizeChart(input: {
            sizeChartId: "${firstSizeChart.id}"
            sizeName: "${sizeName40}"
        }) {
            id
            sizes {
              name
            }
          }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data.addSizeToSizeChart).toEqual({
          id: firstSizeChart.id,
          sizes: [{ name: sizeName40 }],
        });
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not add size to sizeChart with non-existent sizeChartId ', (done) => {
      const sizeName40 = '40';
      const nonExistentSizeChartId = '1cee2dab-8e17-4ca5-989d-20bb516ec9f6';

      const mutation = `
        mutation {
          addSizeToSizeChart(input: {
            sizeChartId: "${nonExistentSizeChartId}"
            sizeName: "${sizeName40}"
        }) {
            id
            sizes {
              name
            }
          }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not add size to sizeChart with with a pre-existing name sizeName ', (done) => {
      const mutation = `
        mutation {
          addSizeToSizeChart(input: {
            sizeChartId: "${secondSizeChart.id}"
            sizeName: "${sizeM.name}"
        }) {
            id
            sizes {
              name
            }
          }
      }
    `;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });
  });

  describe('Query SizeCharts', () => {
    it('should return sizeCharts', (done) => {
      const mutation = `{
        sizeCharts(subCategoryId: "${subCategory.id}") {
          id
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.sizeCharts).toEqual(
          expect.arrayContaining([
            { id: firstSizeChart.id, name: firstSizeChart.name },
            { id: secondSizeChart.id, name: secondSizeChart.name },
          ]),
        );
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not return sizeCharts with non-existent subCategoryId', (done) => {
      const nonExistentSubCategoryId = '070b402c-6664-4533-aadd-d210ca598fce';

      const mutation = `{
        sizeCharts(subCategoryId: "${nonExistentSubCategoryId}") {
          id
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });
  });

  describe('Query Sizes', () => {
    it('should return sizes', (done) => {
      const mutation = `{
        sizes(sizeChartId: "${secondSizeChart.id}") {
          id
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data.sizes).toEqual(
          expect.arrayContaining([{ id: sizeM.id, name: sizeM.name }]),
        );
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });

    it('should not return sizes with non-existent sizeChartId', (done) => {
      const nonExistentSizeChartId = '070b402c-6664-4533-aadd-d210ca598fce';

      const mutation = `{
        sizes(sizeChartId: "${nonExistentSizeChartId}") {
          id
          name
        }
      }`;

      const expectFunction = (res) => {
        expect(res.body.data).toEqual(null);
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });
  });
});
