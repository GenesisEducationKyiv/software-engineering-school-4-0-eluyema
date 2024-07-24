import { Injectable } from "@nestjs/common";

import { AppConfigService } from "../../infrastructure/config/interfaces/app-config.service.interface";
import {
  AppConfig,
  CronConfig,
  DatabaseConfig,
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
    cron: {
      pattern: "0 10 * * *",
    },
    microservices: {
      exchangeRateUrl: "0.0.0.0:3111",
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

  get cron(): CronConfig {
    return this.config.cron;
  }

  set cron(value: CronConfig) {
    this.config.cron = value;
  }

  set microservicesApi(value: MicroservicesConfig) {
    this.config.microservices = value;
  }

  get microservicesApi(): MicroservicesConfig {
    return this.config.microservices;
  }
}
