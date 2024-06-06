import { Controller, Get, Inject } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { FetchExchangeRateApplication } from '../interfaces/applications/fetch-exchange-rate.application.interface';

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
