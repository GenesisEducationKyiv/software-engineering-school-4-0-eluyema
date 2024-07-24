export interface ServerConfig {
  port: number;
  host: string;
}

export interface CronConfig {
  pattern: string;
}

export interface DatabaseConfig {
  url: string;
}

export interface MicroservicesConfig {
  exchangeRateUrl: string;
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  cron: CronConfig;
  microservices: MicroservicesConfig;
}
