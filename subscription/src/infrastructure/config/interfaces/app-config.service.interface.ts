import {
  DatabaseConfig,
  MessageBrokersConfig,
  MicroservicesConfig,
  ServerConfig,
} from "./configuration.interface";

export interface AppConfigService {
  get server(): ServerConfig;

  get database(): DatabaseConfig;

  get microservicesApi(): MicroservicesConfig;

  get messageBrokers(): MessageBrokersConfig;
}
