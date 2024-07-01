import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { AppConfigService } from 'src/shared/infrastructure/config/interfaces/app-config.service.interface';
import { TYPES as SHARED_CONFIG_TYPES } from 'src/shared/infrastructure/ioc';

import { ExchangeRateCronService } from './interfaces/exchange-rate-cron.service.interface';
import { SendExchangeRateToSubscribersApplication } from '../../application/interfaces/send-exchange-rate-to-subscribers.application.interface';
import { TYPES } from '../../ioc/types';

@Injectable()
export class ExchangeRateCronServiceImpl implements ExchangeRateCronService {
  private cronPattern: string;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(TYPES.applications.SendExchangeRateToSubscribersApplication)
    private readonly sendExchangeRateToSubscribersApplication: SendExchangeRateToSubscribersApplication,
    @Inject(SHARED_CONFIG_TYPES.infrastructure.AppConfigService)
    private readonly appConfigService: AppConfigService,
  ) {}

  async onModuleInit() {
    this.cronPattern = this.appConfigService.cron.pattern;
    this.initializeCronJob();
  }

  private initializeCronJob() {
    const callback = async () => {
      try {
        await this.handleCron();
      } catch (err) {
        console.error(err);
      }
    };

    const job = new CronJob(this.cronPattern, callback);
    this.schedulerRegistry.addCronJob('exchangeRateUpdate', job);
    job.start();
  }

  async handleCron() {
    await this.sendExchangeRateToSubscribersApplication.execute();
  }
}
