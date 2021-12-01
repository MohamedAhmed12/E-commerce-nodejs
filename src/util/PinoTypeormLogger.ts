import { PinoLogger } from 'nestjs-pino';
import { Logger as TypeormLogger } from 'typeorm';

export class PinoTypeormLogger implements TypeormLogger {
  constructor(private readonly pinoLogger: PinoLogger) {}

  logQuery(query: string, parameters?: any[]): any {
    this.pinoLogger.debug({ query, parameters }, 'query');
  }

  log(level: 'log' | 'info' | 'warn', message: any): any {
    this.pinoLogger[level](message);
  }

  logMigration(message: string): any {
    this.pinoLogger.info(message);
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]): any {
    this.pinoLogger.error(
      {
        query,
        parameters,
        error,
      },
      'query error',
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]): any {
    this.pinoLogger.warn(
      {
        query,
        parameters,
        time,
      },
      'query is slow',
    );
  }

  logSchemaBuild(message: string): any {
    this.pinoLogger.info(message);
  }
}
