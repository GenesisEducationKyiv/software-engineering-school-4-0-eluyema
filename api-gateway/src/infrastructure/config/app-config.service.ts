import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfigService } from './interfaces/app-config.service.interface';
import {
  AppConfig,
  MicroservicesConfig,
  ServerConfig,
} from './interfaces/configuration.interface';

@Injectable()
export class AppConfigServiceImpl implements AppConfigService {
  constructor(private configService: ConfigService<AppConfig>) {}

  get server(): ServerConfig {
    return this.configService.get<ServerConfig>('server', { infer: true });
  }

  get microservicesApi(): MicroservicesConfig {
    return this.configService.get<MicroservicesConfig>('microservices', {
      infer: true,
    });
  }
}
