import { Inject, Injectable } from '@nestjs/common';

import { ExchangeRateClient } from '../../infrastructure/http/clients/interfaces/exchange-rate.client';
import { TYPES } from '../../infrastructure/ioc/types';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { ExchangeRateFactory } from '../factory/interfaces/exchange-rate.factory.interface';

@Injectable()
export class ExchangeRateService {
  constructor(
    @Inject(TYPES.domain.factories.ExchangeRateFactory)
    private readonly exchangeRateFactory: ExchangeRateFactory,
    @Inject(TYPES.infrastructure.ExchangeRateClient)
    private readonly exchangeRateClient: ExchangeRateClient,
  ) {}

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    const exchangeRatesDto = await this.exchangeRateClient.fetchExchangeRates();

    return this.exchangeRateFactory.create(
      exchangeRatesDto.base,
      exchangeRatesDto.rates.UAH,
      new Date(),
    );
  }
}
