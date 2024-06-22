import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { ExchangeRate } from 'src/modules/exchange-rate/domain/entities/exchange-rate.entity';
import { ExchangeRateFactory } from 'src/modules/exchange-rate/domain/factories/exchange-rate.factory';
import { BaseExchangeRateService } from 'src/modules/exchange-rate/domain/services/exchange-rate.service';
import { AppConfigService } from 'src/shared/infrastructure/config/interfaces/app-config.service.interface';
import { TYPES as SHARED_CONFIG_TYPES } from 'src/shared/infrastructure/ioc';

import { OpenexchangeratesDto } from './dto/openexchangerates.dto';

@Injectable()
export class OpenexchangeratesClientImpl extends BaseExchangeRateService {
  private exchangeApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(SHARED_CONFIG_TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
  ) {
    super();
    this.exchangeApiUrl = appConfigService.exchangeApi.openexchangeratesUrl;
  }

  protected async fetchExchangeRates(): Promise<ExchangeRate> {
    try {
      const exchangeRatesDto = await firstValueFrom(
        this.httpService.get<OpenexchangeratesDto>(this.exchangeApiUrl),
      );

      return ExchangeRateFactory.create(
        exchangeRatesDto.data.base,
        exchangeRatesDto.data.rates.UAH,
        new Date(),
      );
    } catch (err) {
      console.error(err.message);
      throw new Error('Request to get currency rate failed');
    }
  }
}
