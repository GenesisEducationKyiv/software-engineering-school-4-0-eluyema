import { MicroservicesConfig, ServerConfig } from './configuration.interface';

export interface AppConfigService {
  get server(): ServerConfig;

  get microservicesApi(): MicroservicesConfig;
}
