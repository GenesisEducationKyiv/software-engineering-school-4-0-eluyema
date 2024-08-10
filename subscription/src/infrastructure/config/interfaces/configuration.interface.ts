export interface ServerConfig {
  port: number;
  host: string;
}

export interface DatabaseConfig {
  url: string;
}

export interface MicroservicesConfig {
  exchangeRateUrl: string;
}

export interface BrokerConfig {
  host: string;
  groupId: string;
}

export interface MessageBrokersConfig {
  current: BrokerConfig;
  exchangeRate: BrokerConfig;
  mailer: BrokerConfig;
  customers: BrokerConfig;
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  microservices: MicroservicesConfig;
  messageBrokers: MessageBrokersConfig;
}
