import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { PrivatbankDto } from "./dto/privatbank.dto";
import { ExchangeRateClient } from "./interfaces/exchange-rate-client";
import { ExchangeRate } from "../../../domain/entities/exchange-rate.entity";
import { ExchangeRateFactory } from "../../../domain/factories/exchange-rate.factory";
import { AppConfigService } from "../../../infrastructure/config/interfaces/app-config.service.interface";
import { TYPES } from "../../../ioc";

@Injectable()
export class PrivatbankClientImpl implements ExchangeRateClient {
  private exchangeApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
  ) {
    this.exchangeApiUrl = appConfigService.exchangeApi.privatbankUrl;
  }

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    try {
      const exchangeRatesDto = await firstValueFrom(
        this.httpService.get<PrivatbankDto>(this.exchangeApiUrl),
      );

      return ExchangeRateFactory.create(
        exchangeRatesDto.data[1].ccy,
        Number(exchangeRatesDto.data[1].sale),
        new Date(),
      );
    } catch (err) {
      console.error(err.message);
      throw new Error("Request to get currency rate failed");
    }
  }
}
