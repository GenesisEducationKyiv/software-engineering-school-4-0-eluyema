import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { PrivatbankDto } from "./dto/privatbank.dto";
import { ExchangeRateClient } from "./interfaces/exchange-rate-client";
import { ExchangeRate } from "../../../domain/entities/exchange-rate.entity";
import { ExchangeRateFactory } from "../../../domain/factories/exchange-rate.factory";
import { TYPES } from "../../../ioc";
import { AppConfigService } from "../../config/interfaces/app-config.service.interface";
import { MetricsService } from "../../metrics/interfaces/metrics.service.interface";

@Injectable()
export class PrivatbankClientImpl implements ExchangeRateClient {
  private exchangeApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.exchangeApiUrl = appConfigService.exchangeApi.privatbankUrl;
    this.metricsService.initCounter(
      "exchange_rate_fetched_success",
      "Fetch rate success",
      ["source"],
    );
    this.metricsService.initCounter(
      "exchange_rate_fetched_failed",
      "Fetch rate failed",
      ["source"],
    );
  }

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    try {
      const exchangeRatesDto = await firstValueFrom(
        this.httpService.get<PrivatbankDto>(this.exchangeApiUrl),
      );
      this.metricsService.incrementCounter("exchange_rate_fetched_success", {
        source: "privatbank",
      });
      return ExchangeRateFactory.create(
        exchangeRatesDto.data[1].ccy,
        Number(exchangeRatesDto.data[1].sale),
        new Date(),
      );
    } catch (err) {
      this.metricsService.incrementCounter("exchange_rate_fetched_failed", {
        source: "privatbank",
      });
      console.error(err.message);
      throw new Error("Request to get currency rate failed");
    }
  }
}
