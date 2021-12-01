import * as request from 'supertest';

import { initEndToEndTest } from './common/e2e-test';

describe('Application', () => {
  const context = initEndToEndTest();

  it('starts and gets healthy', () => {
    return request(context.app.getHttpServer()).get('/health').expect(200);
  });
});
