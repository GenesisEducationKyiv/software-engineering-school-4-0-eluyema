import { Controller, Get, Inject } from '@nestjs/common';

import { FetchExchangeRateApplication } from '../application/interfaces/fetch-exchange-rate.application.interface';
import { TYPES } from '../ioc/types';

@Controller('rate')
export class ExchangeRateController {
  constructor(
    @Inject(TYPES.applications.FetchExchangeRateApplication)
    private readonly fetchExchangeRateApp: FetchExchangeRateApplication,
  ) {}

  @Get('/')
  async getExchangeRate(): Promise<unknown> {
    return await this.fetchExchangeRateApp.execute();
  }
}
