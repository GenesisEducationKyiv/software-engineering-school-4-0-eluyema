export interface ServerConfig {
  port: number;
  host: string;
}

export interface DatabaseConfig {
  url: string;
}

export interface ExchangeApiConfig {
  url: string;
}

export interface MailerConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface CronConfig {
  pattern: string;
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  exchangeApi: ExchangeApiConfig;
  mailer: MailerConfig;
  cron: CronConfig;
}
