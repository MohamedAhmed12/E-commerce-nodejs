require('dotenv').config({ path: '.env.development' });

module.exports = {
  type: 'postgres',
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  migrations: ['./src/migrations/*.ts'],
  cli: {
    entitiesDir: './src/entities',
    migrationsDir: './src/migrations',
    subscribersDir: './src/subscribers',
  },
};
