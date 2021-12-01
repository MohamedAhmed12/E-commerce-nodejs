import { join } from 'path';

import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { graphqlUploadExpress } from 'graphql-upload';
import { LoggerModule, PinoLogger } from 'nestjs-pino';

import { CommonModule } from './common/common.module';
import configuration, {
  EnvironmentConfig,
  GraphqlConfig,
  PostgresConfig,
} from './configuration';
import { CoreModule } from './core/core.module';
import { SeedModule } from './database/seeds/seed.module';
import { PinoTypeormLogger } from './util/PinoTypeormLogger';

@Module({
  imports: [
    CommonModule,
    CoreModule,
    SeedModule,
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      useFactory: (config: ConfigService, pinoLogger: PinoLogger) => {
        const postgres = config.get<PostgresConfig>('postgres');

        return {
          type: 'postgres',
          port: postgres.port,
          username: postgres.username,
          password: postgres.password,
          database: postgres.database,
          migrationsRun: true,
          autoLoadEntities: true,
          host: postgres.host,
          synchronize: true,
          logging: config.get<EnvironmentConfig>('env').isDevelopment
            ? true
            : ['warn'],
          logger: new PinoTypeormLogger(pinoLogger),
          entities: [join(__dirname, '**/*.entity.js')],
          migrations: [join(__dirname, 'migrations', '*.js')],
        };
      },
      inject: [ConfigService, PinoLogger],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          prettyPrint: config.get<EnvironmentConfig>('env').isDevelopment,
          serializers: {
            req(req) {
              delete req.headers;
              return req;
            },
            res(res) {
              delete res.headers;
              return res;
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.development' : null,
      load: [configuration],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<GraphqlConfig>('graphql');
        return {
          debug: configService.get<EnvironmentConfig>('env').isDevelopment,
          playground: config.playgroundEnabled,
          introspection: config.playgroundEnabled,
          typePaths: ['./src/**/*.graphql'],
          uploads: false, // disable built-in upload handling
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
