import {
  CronConfig,
  ExchangeApiConfig,
  MessageBrokersConfig,
  MicroservicesConfig,
  ServerConfig,
} from "./configuration.interface";

export interface AppConfigService {
  get server(): ServerConfig;

  get exchangeApi(): ExchangeApiConfig;

  get cron(): CronConfig;

  get microservicesApi(): MicroservicesConfig;

  get messageBrokers(): MessageBrokersConfig;
}
