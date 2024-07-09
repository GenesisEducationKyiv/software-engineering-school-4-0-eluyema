export interface ServerConfig {
  port: number;
  host: string;
}

export interface MailerConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface BrokerConfig {
  host: string;
  groupId: string;
}

export interface MessageBrokersConfig {
  current: BrokerConfig;
}

export interface AppConfig {
  server: ServerConfig;
  mailer: MailerConfig;
  messageBroker: MessageBrokersConfig;
}
