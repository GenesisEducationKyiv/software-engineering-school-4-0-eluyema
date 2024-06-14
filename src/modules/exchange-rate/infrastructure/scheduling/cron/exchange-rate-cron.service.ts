import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { FetchExchangeRateApplication } from '../../../interfaces/applications/fetch-exchange-rate.application.interface';
import { ExchangeRateCronService } from '../../../interfaces/cron/exchange-rate-cron.service.interface';
import { ExchangeRateNotificationService } from '../../../interfaces/notification/exchange-rate-notification.service.interface';
import { TYPES } from '../../../interfaces/types';

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
