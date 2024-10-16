export interface ServerConfig {
  port: number;
  host: string;
}

export interface ExchangeApiConfig {
  openexchangeratesUrl: string;
  privatbankUrl: string;
  bankgovUrl: string;
}

export interface MicroservicesConfig {
  mailerUrl: string;
}

export interface CronConfig {
  pattern: string;
}

export interface BrokerConfig {
  host: string;
  groupId: string;
}

export interface MessageBrokersConfig {
  current: BrokerConfig;
  mailer: BrokerConfig;
}

export interface AppConfig {
  server: ServerConfig;
  exchangeApi: ExchangeApiConfig;
  cron: CronConfig;
  microservices: MicroservicesConfig;
  messageBrokers: MessageBrokersConfig;
}
