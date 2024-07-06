import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { ExchangeRate } from "src/domain/entities/exchange-rate.entity";
import { ExchangeRateFactory } from "src/domain/factories/exchange-rate.factory";
import { AppConfigService } from "src/infrastructure/config/interfaces/app-config.service.interface";
import { TYPES } from "src/ioc";

import { OpenexchangeratesDto } from "./dto/openexchangerates.dto";
import { ExchangeRateClient } from "./interfaces/exchange-rate-client";

@Injectable()
export class OpenexchangeratesClientImpl implements ExchangeRateClient {
  private exchangeApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
  ) {
    this.exchangeApiUrl = appConfigService.exchangeApi.openexchangeratesUrl;
  }

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
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
      throw new Error("Request to get currency rate failed");
    }
  }
}
