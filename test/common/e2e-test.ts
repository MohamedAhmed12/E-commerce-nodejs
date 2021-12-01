import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { get } from 'lodash';
import { DateTime } from 'luxon';
import * as request from 'supertest';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { AppModule } from 'src/app.module';
import { ApplicationConfig } from 'src/configuration';

import { UserEntity } from '../../src/core/user/user.entity';
import { AbilityType } from '../../src/graphql-types';
import { AuthFactory } from '../factories/auth.factory';
import { FactoriesModule } from '../factories/factories.module';
import { UserFactory } from '../factories/user.factory';

export interface EndToEndTestContext {
  app: INestApplication;
  config: ApplicationConfig;
  testingModule: TestingModule;
  currentUser: UserEntity;
  currentUserAccessToken: string;
  systemManagerUser: UserEntity;
  systemUserAccessToken: string;
  graphqlRequestTest: (
    query,
    expectedStatus,
    expectFunction,
    doneCallback,
    currentUserAccessToken?,
  ) => any;
}

let startedPostgresContainer: StartedTestContainer | null = null;
let app: any | null = null;
let config: any | null = null;
let testingModule: any | null = null;
let currentUser: any | null = null;
let currentUserAccessToken: string | null = null;
let graphqlRequestTest: (
  query,
  expectedStatus,
  expectFunction,
  doneCallback,
  currentUserAccessToken,
) => any | null = null;

const postgresContainer = new GenericContainer('postgres')
  .withEnv('POSTGRES_USER', 'test-user')
  .withEnv('POSTGRES_PASSWORD', 'test-password')
  .withEnv('POSTGRES_DB', 'test-db')
  .withExposedPorts(5432);

beforeAll(async () => {
  startedPostgresContainer = await postgresContainer.start();

  config = {
    frontendDomain: 'frontend-domain',
    seeds: {
      systemManagerEmails: [],
    },
    port: 8080,
    env: {
      current: 'test',
      isProduction: false,
      isDevelopment: true,
      isTesting: true,
    },
    postgres: {
      host: 'localhost',
      port: startedPostgresContainer.getMappedPort(5432),
      username: 'test-user',
      password: 'test-password',
      database: 'test-db',
    },
    graphql: {
      playgroundEnabled: false,
    },
    emailMailing: {
      apiKey: 'mp-apikey',
      sender: 'mp-sender',
    },
    s3: {
      accessKeyId: '',
      secretAccessKey: '',
      bucket: 'test_s3_bucket',
      region: 'test-s3-region',
    },
  };

  testingModule = await Test.createTestingModule({
    imports: [AppModule, FactoriesModule],
  })
    .overrideProvider(ConfigService)
    .useValue({
      get: (key) => get(config, key),
    })
    .compile();

  currentUser = await testingModule.get(UserFactory).findOrCreate(
    {
      email: 'testUser@gmail.com',
      lastName: 'lastName',
      firstName: 'firstName',
      emailConfirmedAt: DateTime.local(),
      abilityType: AbilityType.SYSTEM_MANAGER,
    },
    null,
  );

  currentUserAccessToken = await testingModule
    .get(AuthFactory)
    .getAccessToken(currentUser.id);

  app = testingModule.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());

  graphqlRequestTest = (
    query: string,
    expectedStatus: number,
    expectFunction: any,
    doneCallback: any,
    userAccessToken: string = currentUserAccessToken,
  ) => {
    request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: query,
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .expect(expectedStatus)
      .end((err, res) => {
        if (err) {
          return doneCallback(err);
        }

        expectFunction(res);

        doneCallback();
      });
  };

  await app.init();
});

afterAll(async () => {
  await startedPostgresContainer.stop();
  await app.close();
  config = null;
  testingModule = null;
});

export function initEndToEndTest(): EndToEndTestContext {
  let context: EndToEndTestContext = {
    app: null,
    config: null,
    testingModule: null,
    currentUser: null,
    currentUserAccessToken: null,
    graphqlRequestTest: null,
    systemManagerUser: null,
    systemUserAccessToken: null,
  };

  beforeAll(async () => {
    context.config = config;
    context.testingModule = testingModule;
    context.currentUser = currentUser;
    context.currentUserAccessToken = currentUserAccessToken;
    context.graphqlRequestTest = graphqlRequestTest;
    context.systemManagerUser = currentUser;
    context.systemUserAccessToken = currentUserAccessToken;
    context.app = app;
  });

  afterAll(async () => {
    context = null;
  });

  return context;
}
