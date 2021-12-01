import { AccountEntity } from '../../../src/core/account/account.entity';
import { NotificationEntity } from '../../../src/core/notification/notification.entity';
import { PersonalNotificationEntity } from '../../../src/core/personal-notification/personal-notification.entity';
import {
  AccountType,
  NotificationActionType,
  NotificationEntityType,
} from '../../../src/graphql-types';
import { initEndToEndTest } from '../../common/e2e-test';
import { AccountFactory } from '../../factories/account.factory';
import { NotificationFactory } from '../../factories/notification.factory';
import { PersonalNotificationFactory } from '../../factories/personal-notification.factory';

describe('PersonalNotification', () => {
  const context = initEndToEndTest();

  let account: AccountEntity;
  let notification: NotificationEntity;
  let personalNotification: PersonalNotificationEntity;

  beforeEach(async () => {
    account =
      account ||
      (await context.testingModule
        .get(AccountFactory)
        .create(
          'Test Account',
          AccountType.BRAND_ACCOUNT,
          context.systemManagerUser,
        ));

    notification ||= await context.testingModule
      .get(NotificationFactory)
      .create(
        NotificationEntityType.USER,
        NotificationActionType.CREATE,
        context.currentUser.id,
      );

    personalNotification ||= await context.testingModule
      .get(PersonalNotificationFactory)
      .create(context.currentUser, notification);
  });

  describe('Get Personal Notifications', () => {
    it(`should returns personal notifications`, (done) => {
      const query = '{ personalNotifications { id, notification { id } } }';
      const expectFunction = (res) => {
        expect(res.body.data.personalNotifications).toEqual([
          {
            id: personalNotification.id,
            notification: { id: notification.id },
          },
        ]);
      };

      context.graphqlRequestTest(query, 200, expectFunction, done);
    });
  });

  describe('Mark as read Personal Notifications', () => {
    it(`should mark as read personal notification`, (done) => {
      const mutation = `mutation { setNotificationAsRead(notificationId: "${notification.id}") { id, readAt } }`;
      const expectFunction = (res) => {
        expect(res.body.data.setNotificationAsRead.readAt).not.toBeNull();
      };

      context.graphqlRequestTest(mutation, 200, expectFunction, done);
    });
  });
});
