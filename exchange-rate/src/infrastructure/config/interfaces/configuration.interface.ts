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

export interface AppConfig {
  server: ServerConfig;
  exchangeApi: ExchangeApiConfig;
  microservices: MicroservicesConfig;
}
