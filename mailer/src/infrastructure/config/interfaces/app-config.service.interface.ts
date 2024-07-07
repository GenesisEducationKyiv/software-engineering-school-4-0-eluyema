import {
  BrokerConfig,
  MailerConfig,
  ServerConfig,
} from "./configuration.interface";

export interface AppConfigService {
  get server(): ServerConfig;

  get mailer(): MailerConfig;

  get broker(): BrokerConfig;
}
