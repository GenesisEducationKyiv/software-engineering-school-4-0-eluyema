import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfigService } from './interfaces/app-config.service.interface';
import {
  AppConfig,
  DatabaseConfig,
  ExchangeApiConfig,
  MailerConfig,
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

  get exchangeApi(): ExchangeApiConfig {
    return this.configService.get<ExchangeApiConfig>('exchangeApi', {
      infer: true,
    });
  }

  get mailer(): MailerConfig {
    return this.configService.get<MailerConfig>('mailer', { infer: true });
  }
}
