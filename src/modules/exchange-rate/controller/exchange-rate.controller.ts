import { Controller, Get, Inject } from '@nestjs/common';

import { FetchExchangeRateApplication } from '../application/interfaces/fetch-exchange-rate.application.interface';
import { TYPES } from '../infrastructure/ioc/types';

@Controller('rate')
export class ExchangeRateController {
  constructor(
    @Inject(TYPES.applications.FetchExchangeRateApplication)
    private readonly fetchExchangeRateApp: FetchExchangeRateApplication,
  ) {}

  @Get('/')
  async getExchangeRate(): Promise<number> {
    const exchangeRate = await this.fetchExchangeRateApp.execute();

    return exchangeRate.rate;
  }
}
