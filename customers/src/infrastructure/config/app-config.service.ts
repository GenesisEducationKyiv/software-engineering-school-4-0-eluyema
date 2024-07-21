import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppConfigService } from "./interfaces/app-config.service.interface";
import {
  AppConfig,
  DatabaseConfig,
  MessageBrokersConfig,
  MicroservicesConfig,
  ServerConfig,
} from "./interfaces/configuration.interface";

@Injectable()
export class AppConfigServiceImpl implements AppConfigService {
  constructor(private configService: ConfigService<AppConfig>) {}

  get server(): ServerConfig {
    return this.configService.get<ServerConfig>("server", { infer: true });
  }

  get database(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>("database", { infer: true });
  }

  get microservicesApi(): MicroservicesConfig {
    return this.configService.get<MicroservicesConfig>("microservices", {
      infer: true,
    });
  }

  get messageBrokers(): MessageBrokersConfig {
    return this.configService.get<MessageBrokersConfig>("messageBrokers", {
      infer: true,
    });
  }
}
