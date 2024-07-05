import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { ExchangeRateCronService } from './interfaces/exchange-rate-cron.service.interface';
import { TriggerSendExchangeRateNotificationApplication } from '../../application/interfaces/trigger-send-exchange-rate-notification.application.interface';
import { TYPES } from '../../ioc/types';
import { AppConfigService } from '../config/interfaces/app-config.service.interface';

@Injectable()
export class ExchangeRateCronServiceImpl implements ExchangeRateCronService {
  private cronPattern: string;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(TYPES.applications.TriggerSendExchangeRateNotificationApplication)
    private readonly triggerSendExchangeRateNotificationApplication: TriggerSendExchangeRateNotificationApplication,
    @Inject(TYPES.infrastructure.AppConfigService)
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
    await this.triggerSendExchangeRateNotificationApplication.execute();
  }
}
