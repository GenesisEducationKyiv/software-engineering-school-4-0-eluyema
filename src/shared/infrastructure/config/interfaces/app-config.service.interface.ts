import {
  CronConfig,
  DatabaseConfig,
  ExchangeApiConfig,
  MailerConfig,
  ServerConfig,
} from './configuration.interface';

export interface AppConfigService {
  get server(): ServerConfig;

  get database(): DatabaseConfig;

  get exchangeApi(): ExchangeApiConfig;

  get mailer(): MailerConfig;

  get cron(): CronConfig;
}
