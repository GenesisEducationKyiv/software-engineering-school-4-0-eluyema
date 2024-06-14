import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ExchangeRateCronService } from './interfaces/exchange-rate-cron.service.interface';
import { FetchExchangeRateApplication } from '../../application/interfaces/fetch-exchange-rate.application.interface';
import { TYPES } from '../ioc/types';
import { ExchangeRateNotificationService } from '../notification/interfaces/exchange-rate-notification.service.interface';

@Injectable()
export class ExchangeRateCronServiceImpl implements ExchangeRateCronService {
  constructor(
    @Inject(TYPES.applications.FetchExchangeRateApplication)
    private readonly fetchExchangeRateApp: FetchExchangeRateApplication,
    @Inject(TYPES.notification.ExchangeRateNotificationService)
    private readonly exchangeRateNotificationService: ExchangeRateNotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleCron() {
    const exchangeRate = await this.fetchExchangeRateApp.execute();
    await this.exchangeRateNotificationService.sendExchangeRateNotification(
      exchangeRate,
    );
  }
}
