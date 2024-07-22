import { Injectable } from "@nestjs/common";

import { AppConfigService } from "../../infrastructure/config/interfaces/app-config.service.interface";
import {
  AppConfig,
  DatabaseConfig,
  MessageBrokersConfig,
  MicroservicesConfig,
  ServerConfig,
} from "../../infrastructure/config/interfaces/configuration.interface";

@Injectable()
export class TestAppConfigServiceImpl implements AppConfigService {
  config: AppConfig = {
    database: {
      url: "0.0.0.0:5232",
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    microservices: {
      exchangeRateUrl: "0.0.0.0:3111",
    },
    messageBrokers: {
      current: {
        host: "0.0.0.0:3111",
        groupId: "id",
      },
      exchangeRate: {
        host: "0.0.0.0:3121",
        groupId: "exchangeRateid",
      },
      mailer: {
        host: "0.0.0.0:3121",
        groupId: "mailerid",
      },
      subscription: {
        host: "0.0.0.0:3121",
        groupId: "subscriptionid",
      },
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

  set microservicesApi(value: MicroservicesConfig) {
    this.config.microservices = value;
  }

  get microservicesApi(): MicroservicesConfig {
    return this.config.microservices;
  }

  get messageBrokers(): MessageBrokersConfig {
    return this.config.messageBrokers;
  }

  set messageBrokers(value: MessageBrokersConfig) {
    this.config.messageBrokers = value;
  }
}
