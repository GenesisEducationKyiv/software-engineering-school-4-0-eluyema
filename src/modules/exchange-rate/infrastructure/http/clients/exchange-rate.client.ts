import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { AppConfigService } from 'src/shared/infrastructure/config/interfaces/app-config.service.interface';
import { TYPES as SHARED_CONFIG_TYPES } from 'src/shared/infrastructure/ioc';

import { GetExchangeRatesDto } from './dto/get-exchange-rates.dto';
import { ExchangeRateClient } from './interfaces/exchange-rate.client';

@Injectable()
export class ExchangeRateClientImpl implements ExchangeRateClient {
  private exchangeApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(SHARED_CONFIG_TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
  ) {
    this.exchangeApiUrl = appConfigService.exchangeApi.url;
  }

  async fetchExchangeRates(): Promise<GetExchangeRatesDto> {
    const response = await firstValueFrom(
      this.httpService.get<GetExchangeRatesDto>(this.exchangeApiUrl),
    );
    return response.data;
  }
}
