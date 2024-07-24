export interface ServerConfig {
  port: number;
  host: string;
}

export interface MicroservicesConfig {
  subscriptionUrl: string;
  exchangeRateUrl: string;
}

export interface AppConfig {
  server: ServerConfig;
  microservices: MicroservicesConfig;
}
