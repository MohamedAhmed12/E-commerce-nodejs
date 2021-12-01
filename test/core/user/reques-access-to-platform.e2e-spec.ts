import { initEndToEndTest } from '../../common/e2e-test';

describe('User requestAccessToPlatform', () => {
  const context = initEndToEndTest();

  beforeEach(async () => {
    jest.mock('@mailchimp/mailchimp_transactional', () => () => ({}));
  });

  it(`should returns OK`, (done) => {
    const mutation = `mutation {requestAccessToPlatform(input: {
        accountType: SHOWROOM
        email: "test@mail.ru"
        companyName: "H&B"
        firstName: "Hanna"
        lastName: "Sunny"
        country: "Belarus"
        phoneNumber: "+375331234567"
        website: "hb.com"
        dataField: "{ \\"a\\": \\"23\\"}"
        }) {
        status
        } }`;

    const expectFunction = (res) => {
      expect(res.body.data.requestAccessToPlatform).toEqual({
        status: 'OK',
      });
    };

    context.graphqlRequestTest(mutation, 200, expectFunction, done);
  });

  it(`validates input parameters, should returns error`, (done) => {
    const mutation1 = `mutation {requestAccessToPlatform(input: {
        accountType: SHOWROOM
        email: "test4567@mail.ru"
        companyName: ""
        firstName: "Hanna"
        lastName: "Sunny"
        country: "Belarus"
        phoneNumber: "+375331234567"
        website: "hb.com"
        dataField: "{ \\"a\\": \\"23\\"}"
        }) {
        status
        } }`;

    const expectFunction = (res) => {
      expect(res.body.data).toEqual(null);
    };

    context.graphqlRequestTest(mutation1, 200, expectFunction, done);

    const mutation2 = `mutation {requestAccessToPlatform(input: {
        accountType: SHOWROOM
        email: "testemail"
        companyName: "Hh"
        firstName: "Hanna"
        lastName: "Sunny"
        country: "Belarus"
        phoneNumber: "+375331234567"
        website: "hb.com"
        dataField: "{ \\"a\\": \\"23\\"}"
        }) {
        status
        } }`;

    context.graphqlRequestTest(mutation2, 200, expectFunction, done);

    const mutation3 = `mutation {requestAccessToPlatform(input: {
        accountType: SHOWROOM
        email: "test@mail.ru"
        companyName: "Hh"
        firstName: "Hanna"
        lastName: "Sunny"
        country: "Belarus"
        phoneNumber: "+37533123456"
        website: "hb.com"
        dataField: "{ \\"a\\": \\"23\\"}"
        }) {
        status
        } }`;

    context.graphqlRequestTest(mutation3, 200, expectFunction, done);

    const mutation4 = `mutation {requestAccessToPlatform(input: {
        accountType: SHOWROOM
        email: "test@mail.ru"
        companyName: "Hh"
        firstName: "Hanna"
        lastName: "Sunny"
        country: "Belarus"
        phoneNumber: "+375331234567"
        website: "hb.com"
        dataField: ""
        }) {
        status
        } }`;

    context.graphqlRequestTest(mutation4, 200, expectFunction, done);
  });
});
