import { Injectable } from "@nestjs/common";

import { AppConfigService } from "../../infrastructure/config/interfaces/app-config.service.interface";
import {
  AppConfig,
  MailerConfig,
  ServerConfig,
} from "../../infrastructure/config/interfaces/configuration.interface";

@Injectable()
export class TestAppConfigServiceImpl implements AppConfigService {
  config: AppConfig = {
    mailer: {
      host: "0.0.0.0",
      port: 3000,
      user: "user",
      password: "pass",
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
  };

  constructor() {}

  get server(): ServerConfig {
    return this.config.server;
  }

  set server(value: ServerConfig) {
    this.config.server = value;
  }

  get mailer(): MailerConfig {
    return this.config.mailer;
  }

  set mailer(value: MailerConfig) {
    this.config.mailer = value;
  }
}