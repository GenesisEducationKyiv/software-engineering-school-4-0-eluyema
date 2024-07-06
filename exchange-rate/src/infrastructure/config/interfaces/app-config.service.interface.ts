import {
  ExchangeApiConfig,
  MicroservicesConfig,
  ServerConfig,
} from "./configuration.interface";

export interface AppConfigService {
  get server(): ServerConfig;

  get exchangeApi(): ExchangeApiConfig;

  get microservicesApi(): MicroservicesConfig;
}
