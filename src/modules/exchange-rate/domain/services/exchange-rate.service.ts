import { Inject, Injectable } from '@nestjs/common';

import { ExchangeRateService } from './interfaces/exchange-rate.service.interface';
import { ExchangeRateClient } from '../../infrastructure/http/clients/interfaces/exchange-rate.client';
import { TYPES } from '../../infrastructure/ioc/types';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { ExchangeRateFactory } from '../factories/exchange-rate.factory';

@Injectable()
export class ExchangeRateServiceImpl implements ExchangeRateService {
  constructor(
    @Inject(TYPES.infrastructure.ExchangeRateClient)
    private readonly exchangeRateClient: ExchangeRateClient,
  ) {}

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    const exchangeRatesDto = await this.exchangeRateClient.fetchExchangeRates();

    return ExchangeRateFactory.create(
      exchangeRatesDto.base,
      exchangeRatesDto.rates.UAH,
      new Date(),
    );
  }
}
