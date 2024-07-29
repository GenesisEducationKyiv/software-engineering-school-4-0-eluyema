import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { ExchangeRate } from "src/domain/entities/exchange-rate.entity";
import { ExchangeRateFactory } from "src/domain/factories/exchange-rate.factory";
import { AppConfigService } from "src/infrastructure/config/interfaces/app-config.service.interface";
import { TYPES } from "src/ioc";

import { OpenexchangeratesDto } from "./dto/openexchangerates.dto";
import { ExchangeRateClient } from "./interfaces/exchange-rate-client";
import { MetricsService } from "../../metrics/interfaces/metrics.service.interface";

@Injectable()
export class OpenexchangeratesClientImpl implements ExchangeRateClient {
  private exchangeApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.exchangeApiUrl = appConfigService.exchangeApi.openexchangeratesUrl;
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
        this.httpService.get<OpenexchangeratesDto>(this.exchangeApiUrl),
      );
      this.metricsService.incrementCounter("exchange_rate_fetched_success", {
        source: "openexchangerates",
      });
      return ExchangeRateFactory.create(
        exchangeRatesDto.data.base,
        exchangeRatesDto.data.rates.UAH,
        new Date(),
      );
    } catch (err) {
      this.metricsService.incrementCounter("exchange_rate_fetched_failed", {
        source: "openexchangerates",
      });
      console.error(err.message);
      throw new Error("Request to get currency rate failed");
    }
  }
}
