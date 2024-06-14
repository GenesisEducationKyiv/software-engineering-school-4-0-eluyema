import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ExchangeRateCronService } from './interfaces/exchange-rate-cron.service.interface';
import { SendExchangeRateToSubscribersApplication } from '../../application/interfaces/send-exchange-rate-to-subscribers.application.interface';
import { TYPES } from '../ioc/types';

@Injectable()
export class ExchangeRateCronServiceImpl implements ExchangeRateCronService {
  constructor(
    @Inject(TYPES.applications.SendExchangeRateToSubscribersApplication)
    private readonly sendExchangeRateToSubscribersApplication: SendExchangeRateToSubscribersApplication,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10M)
  async handleCron() {
    await this.sendExchangeRateToSubscribersApplication.execute();
  }
}
