import { Inject, Injectable } from '@nestjs/common';

import { ExchangeRate } from '../domain/entities/exchange-rate.entity';
import { ExchangeRateService } from '../domain/services/exchange-rate.service';
import { FetchExchangeRateApplication } from '../interfaces/applications/fetch-exchange-rate.application.interface';
import { ExchangeRateClient } from '../interfaces/clients/exchange-rate.client';
import { TYPES } from '../interfaces/types';

@Injectable()
export class FetchExchangeRateApplicationImpl
  implements FetchExchangeRateApplication
{
  constructor(
    @Inject(TYPES.services.ExchangeRateService)
    private readonly exchangeRateService: ExchangeRateService,
    @Inject(TYPES.clients.ExchangeRateClient)
    private readonly exchangeRateClient: ExchangeRateClient,
  ) {}

  async execute(): Promise<ExchangeRate> {
    const data = await this.exchangeRateClient.fetchExchangeRates();

    return this.exchangeRateService.createExchangeRate(
      data.base,
      data.rates.UAH,
      new Date(),
    );
  }
}
