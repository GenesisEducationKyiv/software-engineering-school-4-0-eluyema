import { Injectable } from "@nestjs/common";

import { AppConfigService } from "../../infrastructure/config/interfaces/app-config.service.interface";
import {
  AppConfig,
  CronConfig,
  ExchangeApiConfig,
  MessageBrokersConfig,
  MicroservicesConfig,
  ServerConfig,
} from "../../infrastructure/config/interfaces/configuration.interface";

@Injectable()
export class TestAppConfigServiceImpl implements AppConfigService {
  config: AppConfig = {
    exchangeApi: {
      openexchangeratesUrl: "0.0.0.0:3111",
      privatbankUrl: "0.0.0.0:3111",
      bankgovUrl: "0.0.0.0:3111",
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    cron: {
      pattern: "*/10 * * * * *",
    },
    microservices: {
      mailerUrl: "0.0.0.0:3002",
    },
    messageBrokers: {
      current: {
        host: "0.0.0.0:3002",
        groupId: "myid",
      },
      mailer: {
        host: "0.0.0.0:3001",
        groupId: "mailerid",
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

  get exchangeApi(): ExchangeApiConfig {
    return this.config.exchangeApi;
  }

  set exchangeApi(value: ExchangeApiConfig) {
    this.config.exchangeApi = value;
  }

  set microservicesApi(value: MicroservicesConfig) {
    this.config.microservices = value;
  }

  get microservicesApi(): MicroservicesConfig {
    return this.config.microservices;
  }

  set cron(value: CronConfig) {
    this.config.cron = value;
  }

  get cron(): CronConfig {
    return this.config.cron;
  }

  get messageBrokers(): MessageBrokersConfig {
    return this.config.messageBrokers;
  }

  set messageBrokers(value: MessageBrokersConfig) {
    this.config.messageBrokers = value;
  }
}
