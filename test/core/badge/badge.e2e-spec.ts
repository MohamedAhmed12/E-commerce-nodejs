import { BadgeEntity } from '../../../src/core/badge/badge.entity';
import { initEndToEndTest } from '../../common/e2e-test';
import { BadgFactory } from '../../factories/badg.factory';

describe('Badge', () => {
  const context = initEndToEndTest();

  let badgeA: BadgeEntity;
  let badgeB: BadgeEntity;

  beforeEach(async () => {
    badgeA = await context.testingModule
      .get(BadgFactory)
      .findOrCreate('badgeA');

    badgeB = await context.testingModule
      .get(BadgFactory)
      .findOrCreate('badgeB');
  });

  describe('Get Badges', () => {
    it('should returns badges', (done) => {
      const query = `{
        badges {
          name
        }}`;

      const expectFunction = (res) => {
        expect(res.body.data.badges).toEqual(
          expect.arrayContaining([
            {
              name: badgeA.name,
            },
            {
              name: badgeB.name,
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
