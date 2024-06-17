import { Inject, Injectable } from '@nestjs/common';

import { FetchExchangeRateApplication } from './interfaces/fetch-exchange-rate.application.interface';
import { ExchangeRate } from '../domain/entities/exchange-rate.entity';
import { ExchangeRateService } from '../domain/services/interfaces/exchange-rate.service.interface';
import { TYPES } from '../infrastructure/ioc/types';

@Injectable()
export class FetchExchangeRateApplicationImpl
  implements FetchExchangeRateApplication
{
  constructor(
    @Inject(TYPES.services.ExchangeRateService)
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async execute(): Promise<ExchangeRate> {
    const data = await this.exchangeRateService.getCurrentExchangeRate();

    return data;
  }
}
