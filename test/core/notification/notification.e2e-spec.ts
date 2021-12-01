import { AccountEntity } from '../../../src/core/account/account.entity';
import { BrandEntity } from '../../../src/core/brand/brand.entity';
import { NotificationEntity } from '../../../src/core/notification/notification.entity';
import {
  AccountType,
  NotificationActionType,
  NotificationEntityType,
} from '../../../src/graphql-types';
import { initEndToEndTest } from '../../common/e2e-test';
import { AccountFactory } from '../../factories/account.factory';
import { BrandFactory } from '../../factories/brand.factory';
import { NotificationFactory } from '../../factories/notification.factory';
import { PersonalNotificationFactory } from '../../factories/personal-notification.factory';

describe('Notification', () => {
  const context = initEndToEndTest();

  let account: AccountEntity;
  let brand: BrandEntity;
  let notification: NotificationEntity;

  beforeEach(async () => {
    account = await context.testingModule
      .get(AccountFactory)
      .create(
        'Test Account',
        AccountType.BRAND_ACCOUNT,
        context.systemManagerUser,
      );

    brand = await context.testingModule.get(BrandFactory).create(
      {
        accountId: account.id,
        name: 'Test Brand',
        description: 'Test Description',
      },
      context.systemManagerUser,
    );

    notification = await context.testingModule
      .get(NotificationFactory)
      .create(
        NotificationEntityType.BRAND,
        NotificationActionType.CREATE,
        brand.id,
      );

    await context.testingModule
      .get(PersonalNotificationFactory)
      .create(context.currentUser, notification);
  });

  describe('Get Notifications', () => {
    it(`should returns notifications`, (done) => {
      const query =
        '{ notifications { id, entityType, actionType, entityId } }';

      const expectFunction = (res) => {
        expect(res.body.data.notifications).toEqual([notification]);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });
  });
});
