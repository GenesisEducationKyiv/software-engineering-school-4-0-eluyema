import {
  CronConfig,
  DatabaseConfig,
  MessageBrokersConfig,
  MicroservicesConfig,
  ServerConfig,
} from "./configuration.interface";

export interface AppConfigService {
  get server(): ServerConfig;

  get database(): DatabaseConfig;

  get cron(): CronConfig;

  get microservicesApi(): MicroservicesConfig;

  get messageBrokers(): MessageBrokersConfig;
}
