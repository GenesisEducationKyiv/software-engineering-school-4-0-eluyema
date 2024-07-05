import { MailerConfig, ServerConfig } from "./configuration.interface";

export interface AppConfigService {
  get server(): ServerConfig;

  get mailer(): MailerConfig;
}
