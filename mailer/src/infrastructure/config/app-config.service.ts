import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppConfigService } from "./interfaces/app-config.service.interface";
import {
  AppConfig,
  MailerConfig,
  MessageBrokersConfig,
  ServerConfig,
} from "./interfaces/configuration.interface";

@Injectable()
export class AppConfigServiceImpl implements AppConfigService {
  constructor(private configService: ConfigService<AppConfig>) {}

  get server(): ServerConfig {
    return this.configService.get<ServerConfig>("server", { infer: true });
  }

  get mailer(): MailerConfig {
    return this.configService.get<MailerConfig>("mailer", { infer: true });
  }

  get messageBroker(): MessageBrokersConfig {
    return this.configService.get<MessageBrokersConfig>("messageBroker", {
      infer: true,
    });
  }
}
