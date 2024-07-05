import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfigService } from './interfaces/app-config.service.interface';
import {
  AppConfig,
  CronConfig,
  DatabaseConfig,
  MicroservicesConfig,
  ServerConfig,
} from './interfaces/configuration.interface';

@Injectable()
export class AppConfigServiceImpl implements AppConfigService {
  constructor(private configService: ConfigService<AppConfig>) {}

  get server(): ServerConfig {
    return this.configService.get<ServerConfig>('server', { infer: true });
  }

  get database(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>('database', { infer: true });
  }

  get cron(): CronConfig {
    return this.configService.get<CronConfig>('cron', { infer: true });
  }

  get microservicesApi(): MicroservicesConfig {
    return this.configService.get<CronConfig>('microservices', { infer: true });
  }
}
