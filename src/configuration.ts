export interface ApplicationConfig {
  frontendDomain: string;
  seeds: SeedsConfig;
  port: number;
  env: EnvironmentConfig;
  postgres: PostgresConfig;
  graphql: GraphqlConfig;
  emailMailing: EmailMailingConfig;
  s3: S3Config;
}

export interface EnvironmentConfig {
  current: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isTesting: boolean;
}

export interface PostgresConfig {
  port: number;
  username: string;
  password: string;
  database: string;
  host: string;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
}

export interface EmailMailingConfig {
  apiKey: string;
  sender: string;
}

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
}

export interface SeedsConfig {
  systemManagerEmails: string[];
}

const Development = 'development';
const Testing = 'testing';
const DefaultPort = '8080';

const loadConfig: () => ApplicationConfig = () => {
  const environment = process.env.NODE_ENV ?? Development;
  const isDevelopment = environment === Development;
  const isProduction = environment !== Development && environment !== Testing;
  const isTesting = environment === Testing;

  const defaultGraphqlPlaygroundEnabled =
    isDevelopment || isTesting ? 'true' : 'false';

  const missingVars = [];

  return {
    frontendDomain: env('FRONTEND_DOMAIN'),
    seeds: {
      systemManagerEmails: env('SYSTEM_MANAGER_EMAILS')?.split(',') || [],
    },
    port: parseInt(env('PORT', DefaultPort)),
    env: {
      current: environment,
      isProduction,
      isDevelopment,
      isTesting,
    },
    postgres: {
      host: env('POSTGRES_HOST', 'localhost'),
      port: parseInt(env('POSTGRES_PORT', '5432')),
      username: env('POSTGRES_USERNAME'),
      password: env('POSTGRES_PASSWORD'),
      database: env('POSTGRES_DATABASE'),
    },
    graphql: {
      playgroundEnabled:
        env('GRAPHQL_PLAYGROUND_ENABLED', defaultGraphqlPlaygroundEnabled) ===
        'true',
    },
    emailMailing: {
      apiKey: env('MANDRILL_APP_API_KEY'),
      sender: env('MANDRILL_APP_SENDER'),
    },
    s3: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
      bucket: env('AWS_BUCKET'),
      region: env('AWS_REGION'),
    },
  };

  function env(name: string, defaultValue?: string): string {
    const value = process.env[name] ?? defaultValue;

    if (value === undefined) {
      missingVars.push(name);
    }

    return value;
  }
};

export default loadConfig;
