import { Inject, Injectable } from '@nestjs/common';

import { FetchExchangeRateApplication } from './interfaces/fetch-exchange-rate.application.interface';
import { ExchangeRate } from '../domain/entities/exchange-rate.entity';
import { BaseExchangeRateService } from '../domain/services/exchange-rate.service';
import { TYPES } from '../infrastructure/ioc/types';

@Injectable()
export class FetchExchangeRateApplicationImpl
  implements FetchExchangeRateApplication
{
  constructor(
    @Inject(TYPES.services.ExchangeRateService)
    private readonly exchangeRateService: BaseExchangeRateService,
  ) {}

  async execute(): Promise<ExchangeRate> {
    const data = await this.exchangeRateService.getCurrentExchangeRate();

    return data;
  }
}
