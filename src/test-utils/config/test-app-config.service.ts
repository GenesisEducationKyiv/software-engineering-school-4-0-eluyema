import { Injectable } from '@nestjs/common';

import { AppConfigService } from 'src/shared/infrastructure/config/interfaces/app-config.service.interface';
import {
  AppConfig,
  DatabaseConfig,
  ExchangeApiConfig,
  MailerConfig,
  ServerConfig,
} from 'src/shared/infrastructure/config/interfaces/configuration.interface';

@Injectable()
export class TestAppConfigServiceImpl implements AppConfigService {
  config: AppConfig = {
    mailer: {
      host: '0.0.0.0',
      port: 3000,
      user: 'user',
      password: 'pass',
    },
    database: {
      url: '0.0.0.0:5232',
    },
    exchangeApi: {
      url: '0.0.0.0:3111',
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };

  constructor() {}

  get server(): ServerConfig {
    return this.config.server;
  }

  set server(value: ServerConfig) {
    this.config.server = value;
  }

  get database(): DatabaseConfig {
    return this.config.database;
  }

  set database(value: DatabaseConfig) {
    this.config.database = value;
  }

  get exchangeApi(): ExchangeApiConfig {
    return this.config.exchangeApi;
  }

  set exchangeApi(value: ExchangeApiConfig) {
    this.config.exchangeApi = value;
  }

  get mailer(): MailerConfig {
    return this.config.mailer;
  }

  set mailer(value: MailerConfig) {
    this.config.mailer = value;
  }
}
